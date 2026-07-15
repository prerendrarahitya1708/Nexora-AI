from flask import Blueprint, request, jsonify
from services.orchestrate import ask_nexora

skills_bp = Blueprint("skills", __name__)


@skills_bp.route("/skills", methods=["POST"])
def skills():
    data = request.get_json(silent=True) or {}

    current_skills = data.get("current_skills", "").strip()
    target_role = data.get("target_role", "").strip()

    if not current_skills or not target_role:
        return jsonify({
            "status": "error",
            "message": "current_skills and target_role are required"
        }), 400

    prompt = f"""
Analyze the candidate's skill gap.

Current Skills:
{current_skills}

Target Role:
{target_role}

Provide:
- Current strengths
- Missing skills
- Priority skills to learn
- Recommended courses or certifications
- Estimated readiness for the target role
"""

    try:
        response = ask_nexora(prompt)

        return jsonify({
            "status": "success",
            "agent": "Skill Gap Analyzer",
            "response": response
        })

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500