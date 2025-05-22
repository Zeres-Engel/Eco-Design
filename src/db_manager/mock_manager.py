import logging
from datetime import datetime
from bson import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MockPremiumManager:
    def __init__(self):
        self.premium_types = [
            {"premium_id": 0, "name": "Free", "category": "Không premium", "price": 0},
            {"premium_id": 1, "name": "Trial", "category": "Dùng thử", "price": 0, "trial_days": 7},
            {"premium_id": 2, "name": "Premium Cá nhân (Tháng)", "category": "Cá nhân", "price": 49000},
            {"premium_id": 3, "name": "Premium Cá nhân (Năm)", "category": "Cá nhân", "price": 499000},
            {"premium_id": 4, "name": "Premium Doanh nghiệp (Tháng)", "category": "Doanh nghiệp", "price": 99000},
            {"premium_id": 5, "name": "Premium Doanh nghiệp (Năm)", "category": "Doanh nghiệp", "price": 699000}
        ]
        logger.info("MockPremiumManager initialized with sample data")

    def get_premium_type(self, premium_id):
        for premium in self.premium_types:
            if premium["premium_id"] == int(premium_id):
                return premium
        return None

    def get_all_premium_types(self):
        return self.premium_types

    def clear_collection(self):
        pass

    def initialize_premium_types(self):
        pass


class MockUserManager:
    def __init__(self, payment_manager):
        self.users = {}
        self.payment_manager = payment_manager
        # Add a demo user
        demo_user_id = str(ObjectId())
        self.users[demo_user_id] = {
            '_id': ObjectId(demo_user_id),
            'username': 'demo',
            'password': generate_password_hash('password'),
            'email': 'demo@example.com',
            'premium_id': 1,
            'registration_date': datetime.utcnow()
        }
        logger.info(f"MockUserManager initialized with demo user: {demo_user_id}")

    def create_user(self, username, password, email):
        for user_id, user in self.users.items():
            if user['username'] == username:
                return None, "Username already exists"
            if user['email'] == email:
                return None, "Email already exists"

        user_id = str(ObjectId())
        self.users[user_id] = {
            '_id': ObjectId(user_id),
            'username': username,
            'password': generate_password_hash(password),
            'email': email,
            'premium_id': 1,
            'registration_date': datetime.utcnow()
        }
        
        self.payment_manager.create_payment(
            user_id=user_id,
            amount=0,
            payment_method='None',
            premium_type_id=1
        )
        
        logger.info(f"Created mock user: {username} with ID: {user_id}")
        return user_id, None

    def update_premium_status(self, user_id, premium_id):
        if user_id in self.users:
            self.users[user_id]['premium_id'] = int(premium_id)
            logger.info(f"Updated premium status for user {user_id} to {premium_id}")
            return True
        return False

    def get_user(self, user_id):
        return self.users.get(user_id)

    def get_user_by_username(self, username):
        for user in self.users.values():
            if user['username'] == username:
                return user
        return None

    def get_user_by_email(self, email):
        for user in self.users.values():
            if user['email'] == email:
                return user
        return None

    def update_user(self, user_id, update_data):
        if user_id in self.users:
            for key, value in update_data.items():
                self.users[user_id][key] = value
            logger.info(f"Updated user {user_id}")
            return True
        return False

    def authenticate_user(self, username_or_email, password):
        user = self.get_user_by_username(username_or_email) or self.get_user_by_email(username_or_email)
        if user and check_password_hash(user['password'], password):
            logger.info(f"Authenticated user: {username_or_email}")
            return user
        logger.warning(f"Failed authentication for: {username_or_email}")
        return None
        
    def user_exists(self, username_or_email):
        """Check if a user with the given username or email exists"""
        return self.get_user_by_username(username_or_email) is not None or self.get_user_by_email(username_or_email) is not None

    def clear_collection(self):
        self.users = {}

    def remove_fullname_field(self):
        for user in self.users.values():
            if 'fullname' in user:
                del user['fullname']


class MockSVGeditorManager:
    def __init__(self):
        self.svg_contents = {}
        logger.info("MockSVGeditorManager initialized")

    def save_svg_content(self, user_id, svg_content):
        self.svg_contents[user_id] = svg_content
        logger.info(f"Saved SVG content for user {user_id}")
        return user_id

    def get_svg_content(self, user_id):
        if user_id in self.svg_contents:
            return self.svg_contents[user_id]
        logger.info(f"No SVG content found for user {user_id}")
        return None

    def clear_collection(self):
        self.svg_contents = {}


class MockPaymentManager:
    def __init__(self):
        self.payments = {}
        self.next_order_code = 1000
        logger.info("MockPaymentManager initialized")

    def create_payment(self, user_id, amount, payment_method, premium_type_id):
        order_code = self.next_order_code
        self.next_order_code += 1
        
        payment_id = str(ObjectId())
        self.payments[payment_id] = {
            '_id': ObjectId(payment_id),
            'user_id': user_id,
            'amount': amount,
            'payment_method': payment_method,
            'premium_type_id': premium_type_id,
            'order_code': order_code,
            'status': 'pending',
            'payment_date': datetime.utcnow()
        }
        
        logger.info(f"Created mock payment {payment_id} with order code {order_code}")
        return payment_id, order_code

    def update_payment_status(self, order_code, status):
        for payment in self.payments.values():
            if payment['order_code'] == order_code:
                payment['status'] = status
                logger.info(f"Updated payment status for order {order_code} to {status}")
                return True
        return False

    def get_payment(self, order_code):
        for payment in self.payments.values():
            if payment['order_code'] == order_code:
                return payment
        return None

    def get_latest_payment(self, user_id):
        latest_payment = None
        latest_date = None
        
        for payment in self.payments.values():
            if payment['user_id'] == user_id:
                if latest_date is None or payment['payment_date'] > latest_date:
                    latest_payment = payment
                    latest_date = payment['payment_date']
        
        return latest_payment

    def clear_collection(self):
        self.payments = {}


class MockDBManager:
    def __init__(self):
        logger.info("Initializing MockDBManager - Using in-memory data")
        self.payment_manager = MockPaymentManager()
        self.user_manager = MockUserManager(self.payment_manager)
        self.svg_manager = MockSVGeditorManager()
        self.premium_manager = MockPremiumManager()

    def initialize_database(self):
        self.clear_all_collections()
        self.premium_manager.initialize_premium_types()
        logger.info("Mock database initialized")

    def clear_all_collections(self):
        self.user_manager.clear_collection()
        self.svg_manager.clear_collection()
        self.payment_manager.clear_collection()
        self.premium_manager.clear_collection()
        logger.info("All mock collections cleared")

    def close_connection(self):
        logger.info("Mock database connection closed")
