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


def _call_model(prompt: str, max_tokens: int = 1200) -> str:
    token = _get_token()
    resp = requests.post(
        GENERATE_URL,
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        json={
            "model_id": MODEL_ID,
            "input": prompt,
            "parameters": {"max_new_tokens": max_tokens, "temperature": 0.6},
            "project_id": WATSONX_PROJECT_ID,
        },
        timeout=60,
    )
    resp.raise_for_status()
    return resp.json()["results"][0]["generated_text"].strip()


def analyze_resume(resume_text: str, target_role: str = "") -> str:
    role_line = f"Target Role: {target_role}" if target_role else "No specific target role provided — give general feedback."
    prompt = (
        "You are an expert resume reviewer and career coach with deep knowledge of hiring practices "
        "across tech, business, and creative industries.\n\n"
        "Analyze the resume below and provide structured feedback with these exact sections:\n"
        "**Overall Score:** X/10\n"
        "**Summary:** 2-3 sentence overview\n"
        "**Strengths:** bullet list of what works well\n"
        "**Areas to Improve:** bullet list of specific weaknesses\n"
        "**Actionable Suggestions:** numbered list of concrete improvements\n"
        "**ATS Keywords Missing:** relevant keywords for the target role\n\n"
        f"{role_line}\n\n"
        f"Resume Content:\n{resume_text[:4000]}\n\n"
        "Resume Analysis:"
    )
    return _call_model(prompt, max_tokens=1400)
