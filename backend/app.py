from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

from routes.inventory import inventory_bp
from routes.markdown import markdown_bp

load_dotenv()

def create_app():
    app = Flask(__name__)
    CORS(app)  # Enable CORS for frontend

    # Register blueprints
    app.register_blueprint(inventory_bp, url_prefix='/api/inventory')
    app.register_blueprint(markdown_bp, url_prefix='/api/markdown')

    @app.route('/health', methods=['GET'])
    def health_check():
        return {"status": "healthy"}, 200

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)
