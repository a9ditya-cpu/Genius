from flask import Blueprint, jsonify, request
from models import inventory_collection, markdown_events_collection
import sys
import os

# Add ml_engine to path so we can import models
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'ml_engine')))
from demand_forecast import predict_optimal_price
from price_optimization import advanced_price_optimization

markdown_bp = Blueprint('markdown', __name__)

@markdown_bp.route('/', methods=['POST'])
def trigger_markdown():
    """Trigger a markdown event and apply ML recommendations."""
    data = request.json
    product_id = data.get('product_id')
    discount_percentage = data.get('discount_percentage') # optional overrides
    
    if not product_id:
        return jsonify({"error": "product_id is required"}), 400
        
    product = inventory_collection.find_one({"product_id": product_id}, {"_id": 0})
    if not product:
        return jsonify({"error": "Product not found"}), 404
        
    # ML Engine logic Call
    # 1. Simple Scikit-Learn prediction
    historical_sales = product.get('historical_sales', [])
    current_stock = product.get('quantity', 0)
    base_price = product.get('base_price', 0)
    
    suggested_price = predict_optimal_price(historical_sales, current_stock, base_price)
    
    # 2. Advanced TensorFlow Optimization (placeholder)
    advanced_price = advanced_price_optimization(product)
    
    # Decide final price (here we just use Scikit learn prediction unless specified)
    final_price = data.get('manual_price') or suggested_price
    
    # Record the event
    event = {
        "product_id": product_id,
        "old_price": product['current_price'],
        "new_price": final_price,
        "suggested_price": suggested_price,
        "advanced_suggested_price": advanced_price,
        "reason": data.get("reason", "Routine markdown")
    }
    
    # Save event
    markdown_events_collection.insert_one(event.copy())
    
    # Update inventory price
    inventory_collection.update_one(
        {"product_id": product_id},
        {"$set": {"current_price": final_price}}
    )
    
    return jsonify({
        "success": True,
        "message": "Markdown event triggered",
        "data": event,
        "product": product_id
    }), 200
