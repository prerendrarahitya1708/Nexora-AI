import os
from dotenv import load_dotenv

load_dotenv()

IBM_API_KEY        = os.getenv("IBM_API_KEY")
WATSONX_PROJECT_ID = os.getenv("WATSONX_PROJECT_ID")
WATSONX_URL        = os.getenv("WATSONX_URL", "https://au-syd.ml.cloud.ibm.com")
WATSONX_ORCHESTRATE_INSTANCE_ID = os.getenv("WATSONX_ORCHESTRATE_INSTANCE_ID")
WATSONX_ORCHESTRATE_AGENT_ID    = os.getenv("WATSONX_ORCHESTRATE_AGENT_ID")

