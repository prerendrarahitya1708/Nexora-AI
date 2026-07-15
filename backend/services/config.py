import os
from dotenv import load_dotenv

load_dotenv()

IBM_API_KEY        = os.getenv("IBM_API_KEY")
WATSONX_PROJECT_ID = os.getenv("WATSONX_PROJECT_ID")
WATSONX_URL        = os.getenv("WATSONX_URL", "https://au-syd.ml.cloud.ibm.com")
WATSONX_ORCHESTRATE_INSTANCE_ID = os.getenv("WATSONX_ORCHESTRATE_INSTANCE_ID", "e241ea3d-4adf-47ed-83fa-561aecac0a5f")
WATSONX_ORCHESTRATE_AGENT_ID    = os.getenv("WATSONX_ORCHESTRATE_AGENT_ID", "e33d10b0-1536-468d-8009-3208f38967a9")

