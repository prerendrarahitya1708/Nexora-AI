from flask import Blueprint, request, jsonify
from services.orchestrate import ask_nexora

interview_bp = Blueprint("interview", __name__)


@interview_bp.route("/interview", methods=["POST"])
def interview():
    data = request.get_json(silent=True) or {}

    role = data.get("role", "").strip()
    experience = data.get("experience", "mid-level").strip()
    question = data.get("question", "").strip()
    answer = data.get("answer", "").strip()

    if not role:
        return jsonify({
            "status": "error",
            "message": "role is required"
        }), 400

    if question and answer:
        prompt = f"""
Evaluate the candidate's interview answer.

Role:
{role}

Interview Question:
{question}

Candidate Answer:
{answer}
"""
    else:
        prompt = f"""
Generate a mock interview.

Role:
{role}

Experience Level:
{experience}

Include:
- Behavioural Questions
- Technical Questions
- Situational Questions
- Tips for answering each question
"""

    try:
        response = ask_nexora(prompt)

        return jsonify({
            "status": "success",
            "agent": "Interview Coach",
            "response": response
        })

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500