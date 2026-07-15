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


def _call_model(prompt: str, max_tokens: int = 1024) -> str:
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


def advise_career(query: str) -> str:
    prompt = (
        "You are a world-class career advisor with 20 years of experience in talent development, "
        "career coaching, and industry insights. Give detailed, structured, and actionable career advice.\n\n"
        "Format your response with clear sections using markdown-style headers where helpful.\n"
        "Be specific, practical, and encouraging.\n\n"
        f"User Question: {query}\n\n"
        "Career Advisor:"
    )
    return _call_model(prompt, max_tokens=1200)
