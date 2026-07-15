from flask import Blueprint, request, jsonify
from services.orchestrate import ask_nexora

roadmap_bp = Blueprint("roadmap", __name__)


@roadmap_bp.route("/roadmap", methods=["POST"])
def roadmap():
    data = request.get_json(silent=True) or {}

    goal = data.get("goal", "").strip()
    current_level = data.get("current_level", "beginner").strip()
    weeks = int(data.get("weeks", 12))

    if not goal:
        return jsonify({
            "status": "error",
            "message": "goal is required"
        }), 400

    prompt = f"""
Create a personalized {weeks}-week learning roadmap.

Goal:
{goal}

Current Level:
{current_level}

Include:
- Weekly learning objectives
- Recommended resources
- Hands-on projects
- Certifications (if applicable)
- Milestones to track progress
"""

    try:
        response = ask_nexora(prompt)

        return jsonify({
            "status": "success",
            "agent": "Learning Roadmap",
            "response": response
        })

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500