from flask import Blueprint, request, jsonify
from agents.orchestrator import handle

chat_bp = Blueprint("chat", __name__)


@chat_bp.route("/chat", methods=["POST"])
def chat():
    data  = request.get_json(silent=True) or {}
    query = data.get("query", "").strip()
    if not query:
        return jsonify({"status": "error", "message": "query is required"}), 400
    try:
        response = handle(query)
        return jsonify({"status": "success", "query": query, "response": response})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
