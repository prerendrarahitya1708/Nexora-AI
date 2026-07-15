from services.orchestrate import ask_nexora

def handle(query: str) -> str:
    """
    Send every query to IBM watsonx Orchestrate.
    The Manager Agent will decide which specialist agent to use.
    """
    return ask_nexora(query)