from flask import Blueprint, request, jsonify
from transformers import pipeline
import os

nlp_bp = Blueprint('nlp_bp', __name__)

# Initialize the NLP pipeline globally so it stays loaded in memory
try:
    print("Initializing local HuggingFace BERT Pipeline...")
    # A real, small BERT model optimized for QA
    nlp_model = pipeline("question-answering", model="distilbert-base-cased-distilled-squad")
    print("BERT pipeline ready!")
except Exception as e:
    print(f"Warning: Failed to load NLP pipeline (this requires an active internet connection on first run to download the ~260MB model). Error: {e}")
    nlp_model = None

@nlp_bp.route('/chat', methods=['POST'])
def chat():
    if not nlp_model:
        return jsonify({"answer": "Error: NLP Engine Offline. Model failed to load."}), 503
        
    data = request.json
    user_query = data.get('query', '')
    context_data = data.get('context', '')
    
    # We build a context string from the inventory data sent by the frontend
    context = f"The current warehouse inventory consists of the following data: {context_data}. You are a helpful AI logistics bot."

    if not user_query:
        return jsonify({"error": "No query provided"}), 400

    try:
        # Execute the real BERT Neural Network inference
        result = nlp_model({
            "question": user_query,
            "context": context
        })
        
        answer = result.get('answer', "I couldn't find the data.")
        confidence = result.get('score', 0.0) * 100

        # Format a beautifully AI-like response
        response_text = f"BERT Extraction [Confidence: {confidence:.1f}%] ► {answer}"
        
        return jsonify({
            "answer": response_text,
            "raw_result": result,
            "extracted_value": answer
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e), "answer": f"System fault during NLP inference: {e}"}), 500
