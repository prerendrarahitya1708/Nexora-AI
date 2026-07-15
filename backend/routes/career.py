from flask import Blueprint, request, jsonify
from services.orchestrate import ask_nexora

career_bp = Blueprint("career", __name__)


@career_bp.route("/career", methods=["POST"])
def career():
    data = request.get_json(silent=True) or {}
    user_query = data.get("query", "").strip()

    if not user_query:
        return jsonify({
            "status": "error",
            "message": "Query is required"
        }), 400

    prompt = f"""
Provide career guidance for the following query.

User Question:
{user_query}
"""

    try:
        response = ask_nexora(prompt)

        return jsonify({
            "status": "success",
            "agent": "Career Advisor",
            "response": response
        })

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500