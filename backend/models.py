from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/inventory_db")
client = MongoClient(MONGO_URI)
db = client.get_database()

# Collections
inventory_collection = db["inventory"]
markdown_events_collection = db["markdown_events"]

# Initialize with some mock data if empty
def init_db():
    if inventory_collection.count_documents({}) == 0:
        mock_data = [
            {
                "product_id": "P1001",
                "name": "Classic T-Shirt",
                "category": "Apparel",
                "quantity": 150,
                "base_price": 25.0,
                "current_price": 25.0,
                "historical_sales": [10, 15, 8, 20, 12] # mock last 5 weeks
            },
            {
                "product_id": "P1002",
                "name": "Wireless Headphones",
                "category": "Electronics",
                "quantity": 40,
                "base_price": 120.0,
                "current_price": 120.0,
                "historical_sales": [5, 2, 7, 4, 3]
            },
             {
                "product_id": "P1003",
                "name": "Running Shoes",
                "category": "Footwear",
                "quantity": 85,
                "base_price": 80.0,
                "current_price": 80.0,
                "historical_sales": [20, 25, 18, 30, 22]
            }
        ]
        inventory_collection.insert_many(mock_data)
        print("Mock inventory initialized.")

init_db()
