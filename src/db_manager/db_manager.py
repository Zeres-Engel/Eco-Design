from pymongo import MongoClient
from bson import ObjectId
from .user_manager import UserManager
from .svg_manager import SVGeditorManager
from .payment_manager import PaymentManager
from .premium_manager import PremiumManager

class DBManager:
    def __init__(self, connection_string):
        self.client = MongoClient(connection_string)
        self.db = self.client['ecodesign_db']
        self.payment_manager = PaymentManager(self.db)
        self.user_manager = UserManager(self.db, self.payment_manager)
        self.svg_manager = SVGeditorManager(self.db)
        self.premium_manager = PremiumManager(self.db)

    def initialize_database(self):
        self.clear_all_collections()
        self.premium_manager.initialize_premium_types()
        self.user_manager.remove_fullname_field()
        
        # Create admin account with premium privileges
        admin_id, error = self.user_manager.create_user(
            username="admin",
            password="admin123",
            email="admin@ecologicaldesign.tech"
        )
        
        if admin_id:
            # Set admin to Premium Doanh nghiệp (Năm) - premium_id=5
            self.user_manager.update_premium_status(admin_id, 5)
            
            # Create a completed payment record for the admin
            self.payment_manager.create_payment(
                user_id=admin_id,
                amount=699000,  # Premium Doanh nghiệp (Năm)
                payment_method='System',
                premium_type_id=5,
                status='completed'
            )
            
            print(f"Admin account created successfully with ID: {admin_id}")
            print("Username: admin")
            print("Password: admin123")
            print("Premium: Premium Doanh nghiệp (Năm)")
        else:
            print(f"Failed to create admin account: {error}")

    def clear_all_collections(self):
        self.user_manager.clear_collection()
        self.svg_manager.clear_collection()
        self.payment_manager.clear_collection()
        self.premium_manager.clear_collection()

    def close_connection(self):
        self.client.close()