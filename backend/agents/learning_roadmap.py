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


def _call(prompt: str, max_tokens: int = 1400) -> str:
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


def build_roadmap(goal: str, current_level: str = "beginner", weeks: int = 12) -> str:
    prompt = (
        "You are an expert learning coach and curriculum designer.\n\n"
        "Build a detailed, week-by-week learning roadmap for the user's goal.\n\n"
        "Format the roadmap as:\n"
        "**Goal:** restate the goal clearly\n"
        "**Overview:** 2-3 sentence summary\n"
        "**Phase 1 — Foundations (Weeks 1-3):** topics, resources, projects\n"
        "**Phase 2 — Core Skills (Weeks 4-7):** topics, resources, projects\n"
        "**Phase 3 — Advanced (Weeks 8-10):** topics, resources, projects\n"
        "**Phase 4 — Portfolio & Practice (Weeks 11-12):** projects to build\n"
        "**Recommended Resources:** free and paid options\n"
        "**Milestones:** how to know you're on track\n\n"
        f"Goal: {goal}\n"
        f"Current Level: {current_level}\n"
        f"Timeframe: {weeks} weeks\n\n"
        "Learning Roadmap:"
    )
    return _call(prompt, 1400)
