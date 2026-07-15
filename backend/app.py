from flask import Flask
from flask_cors import CORS

from routes.career import career_bp
from routes.skills import skills_bp
from routes.roadmap import roadmap_bp
from routes.interview import interview_bp
from routes.resume import resume_bp
from routes.chat import chat_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(chat_bp)
app.register_blueprint(career_bp)
app.register_blueprint(skills_bp)
app.register_blueprint(roadmap_bp)
app.register_blueprint(interview_bp)
app.register_blueprint(resume_bp)

@app.route("/")
def home():
    return {
        "status": "success",
        "message": "Welcome to Nexora AI Backend"
    }

if __name__ == "__main__":
    app.run(debug=True)