import requests
from services.config import IBM_API_KEY, WATSONX_PROJECT_ID, WATSONX_URL

IAM_URL      = "https://iam.cloud.ibm.com/identity/token"
MODEL_ID     = "meta-llama/llama-3-3-70b-instruct"
GENERATE_URL = f"{WATSONX_URL}/ml/v1/text/generation?version=2023-05-29"

_token_cache: dict = {"token": None, "expires_at": 0}


def _get_token() -> str:
    import time
    now = time.time()
    if _token_cache["token"] and now < _token_cache["expires_at"]:
        return _token_cache["token"]
    resp = requests.post(
        IAM_URL,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        data={"grant_type": "urn:ibm:params:oauth:grant-type:apikey", "apikey": IBM_API_KEY},
        timeout=15,
    )
    resp.raise_for_status()
    payload = resp.json()
    _token_cache["token"] = payload["access_token"]
    _token_cache["expires_at"] = now + payload.get("expires_in", 3600) - 300
    return _token_cache["token"]


def _call(prompt: str, max_tokens: int = 1200) -> str:
    token = _get_token()
    resp = requests.post(
        GENERATE_URL,
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        json={
            "model_id": MODEL_ID,
            "input": prompt,
            "parameters": {"max_new_tokens": max_tokens, "temperature": 0.7},
            "project_id": WATSONX_PROJECT_ID,
        },
        timeout=60,
    )
    resp.raise_for_status()
    return resp.json()["results"][0]["generated_text"].strip()


def generate_questions(role: str, experience: str = "mid-level") -> str:
    prompt = (
        "You are a senior technical interviewer with 15 years of hiring experience.\n\n"
        "Generate a realistic mock interview for the role below.\n\n"
        "Include:\n"
        "**Behavioural Questions (3):** STAR-method questions\n"
        "**Technical Questions (4):** role-specific technical questions\n"
        "**Situational Questions (2):** hypothetical scenarios\n"
        "**Questions to Ask the Interviewer (3):** smart questions the candidate should ask\n\n"
        "For each question, add a brief tip on how to answer it well.\n\n"
        f"Role: {role}\n"
        f"Experience Level: {experience}\n\n"
        "Interview Questions:"
    )
    return _call(prompt, 1200)


def evaluate_answer(question: str, answer: str, role: str = "") -> str:
    prompt = (
        "You are an expert interview coach. Evaluate the candidate's answer.\n\n"
        "Provide feedback in this format:\n"
        "**Score:** X/10\n"
        "**What Worked Well:** bullet points\n"
        "**What to Improve:** bullet points\n"
        "**Ideal Answer Structure:** a brief guide\n"
        "**Sample Strong Answer:** a rewritten version of their answer\n\n"
        f"Role: {role or 'general'}\n"
        f"Question: {question}\n"
        f"Candidate Answer: {answer}\n\n"
        "Evaluation:"
    )
    return _call(prompt, 1000)
