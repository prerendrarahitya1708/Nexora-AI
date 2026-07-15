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
            "parameters": {"max_new_tokens": max_tokens, "temperature": 0.65},
            "project_id": WATSONX_PROJECT_ID,
        },
        timeout=60,
    )
    resp.raise_for_status()
    return resp.json()["results"][0]["generated_text"].strip()


def analyze_skill_gap(current_skills: str, target_role: str) -> str:
    prompt = (
        "You are an expert career development coach specializing in skills assessment.\n\n"
        "Analyze the skill gap between the user's current skills and their target role.\n\n"
        "Provide a structured response with these sections:\n"
        "**Skill Gap Summary:** Brief overview\n"
        "**Skills You Already Have:** list of matching/relevant skills\n"
        "**Critical Skills Missing:** must-have skills for the role\n"
        "**Nice-to-Have Skills:** secondary skills that help\n"
        "**Priority Learning Order:** numbered list of what to learn first\n"
        "**Estimated Time to Ready:** realistic timeline\n\n"
        f"Current Skills: {current_skills}\n"
        f"Target Role: {target_role}\n\n"
        "Skill Gap Analysis:"
    )
    return _call(prompt, 1200)
