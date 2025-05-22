import os
from dotenv import load_dotenv
from payos import PayOS, PaymentData
from flask import Flask, render_template, jsonify, request, redirect, url_for
from utils import handle_nesting_request
from src.db_manager import DBManager
from src.db_manager.mock_manager import MockDBManager
import hashlib
import time
from datetime import datetime, timedelta
import logging
import random
import sys

# Load environment variables from .env file
load_dotenv()

# Configure logging to write to both file and console
log_formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')

# File handler
if not os.path.exists('./log'):
    os.makedirs('./log')
    
file_handler = logging.FileHandler('./log/app.log')
file_handler.setFormatter(log_formatter)

# Console handler
console_handler = logging.StreamHandler(sys.stdout)
console_handler.setFormatter(log_formatter)

# Root logger configuration
logger = logging.getLogger()
logger.setLevel(logging.INFO)
logger.addHandler(file_handler)
logger.addHandler(console_handler)

app = Flask(__name__, static_folder='app/static', template_folder='app/templates')

# Try to connect to MongoDB (prioritize local Docker instance if available)
try:
    # Try Docker MongoDB first, then fall back to remote MongoDB
    connection_string = os.getenv('MONGODB_DOCKER_URI') or os.getenv('MONGODB_URI')
    db_manager = DBManager(connection_string)
    logger.info(f"Connected to MongoDB successfully using: {connection_string.split('@')[1] if '@' in connection_string else 'local connection'}")
    
    # Initialize database with premium types if needed
    try:
        db_manager.initialize_database()
        logger.info("Database initialized with required collections")
    except Exception as init_error:
        logger.warning(f"Database initialization error: {str(init_error)}")
        
except Exception as e:
    logger.warning(f"Failed to connect to MongoDB: {str(e)}")
    logger.info("Using MockDBManager instead")
    db_manager = MockDBManager()

payOS = PayOS(
    client_id=os.getenv('PAYOS_CLIENT_ID'),
    api_key=os.getenv('PAYOS_API_KEY'),
    checksum_key=os.getenv('PAYOS_CHECKSUM_KEY')
)

@app.route('/')
def home():
    message = request.args.get('message')
    premium_types = db_manager.premium_manager.get_all_premium_types()
    return render_template('index.html', premium_types=premium_types, message=message)

@app.route('/nest', methods=['POST'])
def nest():
    
    new_svg_content = handle_nesting_request()
    
    with open('updated_output.svg', 'w') as file:
        file.write(new_svg_content)

    return jsonify({'new_svg_content': new_svg_content})

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username_or_email = data.get('username_or_email')
    password = data.get('password')

    if not username_or_email or not password:
        return jsonify({"message": "Missing required fields"}), 400

    user = db_manager.user_manager.authenticate_user(username_or_email, password)

    if user:
        svg_content = db_manager.svg_manager.get_svg_content(str(user['_id']))
        
        # Tính toán số ngày còn lại
        remain_days = None
        premium_type = db_manager.premium_manager.get_premium_type(user['premium_id'])
        
        logging.debug(f"User: {user}")
        logging.debug(f"Premium Type: {premium_type}")

        if premium_type:
            # Lấy thông tin thanh toán gần nhất
            last_payment = db_manager.payment_manager.get_latest_payment(user['_id'])
            logging.debug(f"Last Payment: {last_payment}")

            if last_payment and last_payment['status'] == 'completed':
                payment_date = last_payment['payment_date']
                premium_duration_days = premium_type.get('trial_days', 0) if user['premium_id'] == 1 else (30 if user['premium_id'] in [2, 4] else 365)
                elapsed_days = (datetime.utcnow() - payment_date).days
                remain_days = max(0, premium_duration_days - elapsed_days)
                logging.debug(f"Elapsed Days: {elapsed_days}, Remain Days: {remain_days}")

            # Always assign a remain_days value
            if remain_days is None or remain_days == 0:
                if user['premium_id'] == 1:
                    remain_days = 7
                elif user['premium_id'] in [2, 4]:
                    remain_days = random.randint(1, 30)
                elif user['premium_id'] in [3, 5]:
                    remain_days = random.randint(1, 365)

        return jsonify({
            "message": "Login successful",
            "user_id": str(user['_id']),
            "email": user['email'],
            "username": user['username'],
            "premium_id": user['premium_id'],
            "svg_content": svg_content,
            "remain_days": remain_days
        }), 200
    else:
        user_exists = db_manager.user_manager.user_exists(username_or_email)
        if user_exists:
            return jsonify({"message": "Incorrect password"}), 401
        else:
            return jsonify({"message": "Account does not exist in the system"}), 404

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    user_id, error_message = db_manager.user_manager.create_user(username, password, email)

    if user_id:
        return jsonify({"message": "User registered successfully!", "user_id": user_id}), 201
    else:
        return jsonify({"message": error_message}), 400

@app.route('/save_svg', methods=['POST'])
def save_svg():
    data = request.get_json()
    user_id = data.get('user_id')
    svg_content = data.get('svg_content')

    if not user_id or not svg_content:
        return jsonify({"message": "Missing required fields"}), 400

    # Check if the user exists
    user = db_manager.user_manager.get_user(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    # Save the SVG content
    db_manager.svg_manager.save_svg_content(user_id, svg_content)

    return jsonify({"message": "SVG content saved successfully"}), 200

@app.route('/create_payment', methods=['POST'])
def create_payment():
    data = request.get_json()
    user_id = data.get('user_id')
    premium_id = data.get('premium_id')

    if not user_id or not premium_id:
        return jsonify({"message": "Missing required fields"}), 400

    user = db_manager.user_manager.get_user(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    premium_type = db_manager.premium_manager.get_premium_type(premium_id)
    if not premium_type:
        return jsonify({"message": "Invalid premium type"}), 400

    payment_id, order_code = db_manager.payment_manager.create_payment(
        user_id, 
        premium_type['price'], 
        'PayOS', 
        premium_id
    )

    description = f"Pay for {user['username']}"

    # Tạo signature
    signature_data = f"{order_code}|{premium_type['price']}|{description}"
    signature = hashlib.sha256(signature_data.encode()).hexdigest()

    # Create payment link with PayOS
    payment_data = PaymentData(
        amount=premium_type['price'],
        description=description,
        orderCode=order_code,
        cancelUrl=url_for('payment_cancel', _external=True),
        returnUrl=url_for('payment_success', _external=True),
        signature=signature
    )

    try:
        payment_link = payOS.createPaymentLink(payment_data)
        return jsonify({
            "message": "Payment created successfully",
            "payment_id": str(payment_id),
            "order_code": order_code,
            "payment_url": payment_link.checkoutUrl
        }), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500

@app.route('/payment/success', methods=['GET'])
def payment_success():
    order_code = request.args.get('orderCode')
    
    try:
        payment_info = payOS.getPaymentLinkInformation(order_code)
        if payment_info.status == 'PAID':
            payment = db_manager.payment_manager.get_payment(int(order_code))
            if payment:
                user_id = payment['user_id']
                premium_id = payment['premium_type_id']
                db_manager.payment_manager.update_payment_status(int(order_code), 'completed')
                db_manager.user_manager.update_premium_status(user_id, premium_id)
    except Exception as e:
        print(f"Error processing payment: {str(e)}")
    
    return redirect(url_for('home'))

@app.route('/payment/cancel', methods=['GET'])
def payment_cancel():
    order_code = request.args.get('orderCode')
    db_manager.payment_manager.update_payment_status(int(order_code), 'cancelled')
    return redirect(url_for('home'))

@app.route('/save_svg_source', methods=['POST'])
def save_svg_source():
    data = request.get_json()
    user_id = data.get('user_id')
    svg_content = data.get('svg_content')

    if not user_id or not svg_content:
        return jsonify({"message": "Missing required fields"}), 400

    # Check if the user exists
    user = db_manager.user_manager.get_user(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    # Save the SVG content
    db_manager.svg_manager.save_svg_content(user_id, svg_content)

    return jsonify({"message": "SVG source saved successfully"}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
    db_manager.close_connection()