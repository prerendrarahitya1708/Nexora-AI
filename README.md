# 🤖 Nexora AI – Agentic Career Counseling Companion

Nexora AI is an AI-powered Career Guidance Platform developed using **IBM watsonx Orchestrate**. It helps students and job seekers make informed career decisions through intelligent career guidance, resume analysis, skill gap identification, personalized learning roadmaps, and interview preparation.

---

## 📌 Problem Statement

Students often struggle to make informed career decisions due to:

- Lack of personalized career guidance
- Inefficient resume optimization
- Difficulty identifying skill gaps
- Absence of structured learning plans
- Limited interview preparation support

Nexora AI addresses these challenges using an Agentic AI approach.

---

# 🚀 Features

### 🎯 Career Advisor
- Personalized career guidance
- Career recommendations
- Industry insights
- Career transition suggestions

### 📄 Resume Analyzer
- Resume analysis
- ATS improvement suggestions
- Resume quality feedback
- Career recommendations

### 📊 Skill Gap Analyzer
- Skill gap identification
- Missing skills detection
- Learning recommendations
- Career readiness analysis

### 🗺️ Learning Roadmap
- Personalized learning roadmap
- Weekly learning plan
- Recommended courses
- Skill development strategy

### 🎤 Interview Coach
- Interview question generation
- AI interview evaluation
- Personalized interview feedback
- Preparation guidance

---

# 🧠 Agentic AI Workflow

```
User
   │
   ▼
IBM watsonx Orchestrate Agent
   │
   ├── Career Guidance
   ├── Resume Analysis
   ├── Skill Gap Analysis
   ├── Learning Roadmap
   └── Interview Coaching
   │
   ▼
Personalized Career Recommendations
```

---

# 🏗️ Technology Stack

## Frontend
- React.js
- Vite
- Axios
- CSS3
- Framer Motion

## Backend
- Python
- Flask
- Flask-CORS
- Requests
- python-dotenv
- PyPDF2

## IBM Technologies
- IBM watsonx Orchestrate
- IBM IAM Authentication
- IBM Cloud

---

# 📂 Project Structure

```
Nexora-AI
│
├── backend
│   ├── agents
│   ├── routes
│   ├── services
│   ├── app.py
│   └── requirements.txt
│
├── frontend
│   ├── src
│   ├── public
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# ⚙️ Installation

## Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

---

# 🔐 Environment Variables

Create a `.env` file inside the backend folder.

```
IBM_API_KEY=YOUR_API_KEY
WATSONX_PROJECT_ID=YOUR_PROJECT_ID
WATSONX_URL=https://au-syd.ml.cloud.ibm.com
WATSONX_ORCHESTRATE_INSTANCE_ID=YOUR_INSTANCE_ID
WATSONX_ORCHESTRATE_AGENT_ID=YOUR_AGENT_ID
```

---

# 📸 Screenshots

- Landing Page
- Career Advisor
- Resume Analyzer
- Skill Gap Analyzer
- Learning Roadmap
- Interview Coach

---

# 🎯 Future Enhancements

- Multi-agent orchestration
- Job portal integration
- LinkedIn profile analysis
- AI mock interviews with voice
- Student progress dashboard
- Industry trend analysis

---

# 👨‍💻 Developed By

**Rahitya Patchava**

B.Tech – Computer Science (AI & ML)

IBM SkillsBuild Internship Project

---

# 📄 License

This project is developed for educational and internship purposes.
