import requests
import re
from services.config import (
    IBM_API_KEY,
    WATSONX_PROJECT_ID,
    WATSONX_URL,
    WATSONX_ORCHESTRATE_INSTANCE_ID,
    WATSONX_ORCHESTRATE_AGENT_ID
)

IAM_URL = "https://iam.cloud.ibm.com/identity/token"

# Parse region from WATSONX_URL (e.g. au-syd)
region = "au-syd"
if WATSONX_URL:
    match = re.search(r"https://([^.]+)\.ml\.cloud\.ibm\.com", WATSONX_URL)
    if match:
        region = match.group(1)

ORCHESTRATE_URL = (
    f"https://api.{region}.watson-orchestrate.cloud.ibm.com"
    f"/instances/{WATSONX_ORCHESTRATE_INSTANCE_ID}"
    f"/v1/orchestrate/{WATSONX_ORCHESTRATE_AGENT_ID}/chat/completions"
)

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


def ask_nexora(question: str) -> str:
    token = _get_token()
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "X-IBM-Tenant-Id": WATSONX_ORCHESTRATE_INSTANCE_ID
    }
    payload = {
        "messages": [
            {
                "role": "user",
                "content": question
            }
        ],
        "stream": False
    }
    resp = requests.post(
        ORCHESTRATE_URL,
        headers=headers,
        json=payload,
        timeout=60,
    )
    resp.raise_for_status()
    resp_data = resp.json()
    return resp_data["choices"][0]["message"]["content"].strip()

