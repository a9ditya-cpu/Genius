from flask import Blueprint, jsonify, request
from models import inventory_collection

inventory_bp = Blueprint('inventory', __name__)

@inventory_bp.route('/', methods=['GET'])
def get_inventory():
    """Fetch current stock levels."""
    try:
        items = list(inventory_collection.find({}, {"_id": 0}))
        return jsonify({"success": True, "data": items}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@inventory_bp.route('/update', methods=['PUT'])
def update_inventory():
    """Real-time stock and price updates."""
    data = request.json
    if not data or 'product_id' not in data:
        return jsonify({"error": "Missing product_id"}), 400
    
    product_id = data.pop('product_id')
    
    try:
        result = inventory_collection.update_one(
            {"product_id": product_id},
            {"$set": data}
        )
        if result.modified_count == 1:
            return jsonify({"success": True, "message": "Inventory updated successfully"}), 200
        return jsonify({"success": False, "message": "Product not found or no changes made"}), 404
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
