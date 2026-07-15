import os
import re
import zipfile
from xml.etree import ElementTree as ET

from flask import Blueprint, request, jsonify
from services.orchestrate import ask_nexora

resume_bp = Blueprint("resume", __name__)

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), "..", "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

ALLOWED_EXTENSIONS = {"pdf", "txt", "doc", "docx"}


def _allowed(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def _extract_text(file_storage) -> str:
    filename = file_storage.filename.lower()
    file_storage.stream.seek(0)

    if filename.endswith(".pdf"):
        try:
            import PyPDF2
            reader = PyPDF2.PdfReader(file_storage)
            return "\n".join(page.extract_text() or "" for page in reader.pages).strip()
        except Exception:
            return ""

    if filename.endswith(".docx"):
        try:
            with zipfile.ZipFile(file_storage) as archive:
                xml_content = archive.read("word/document.xml")

            root = ET.fromstring(xml_content)

            namespace = {
                "w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
            }

            paragraphs = []

            for node in root.findall(".//w:t", namespace):
                if node.text:
                    paragraphs.append(node.text)

            return "\n".join(paragraphs).strip()

        except Exception:
            return ""

    try:
        return file_storage.read().decode("utf-8", errors="ignore").strip()
    except Exception:
        return ""


@resume_bp.route("/resume", methods=["POST"])
def resume():

    target_role = request.form.get("target_role", "").strip()

    resume_text = ""

    if "file" in request.files:
        file = request.files["file"]

        if file and file.filename and _allowed(file.filename):
            resume_text = _extract_text(file)

    if not resume_text:
        data = request.get_json(silent=True) or {}
        resume_text = data.get("text", "").strip()

    if not resume_text:
        return jsonify({
            "status": "error",
            "message": "No resume content provided"
        }), 400

    resume_text = re.sub(r"\s+", " ", resume_text).strip()

    prompt = f"""
Analyze my resume for the role of {target_role if target_role else "General"}.

Resume:

{resume_text}
"""

    try:
        response = ask_nexora(prompt)

        return jsonify({
            "status": "success",
            "agent": "Resume Analyzer",
            "response": response
        })

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500