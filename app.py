import json
import os
import pickle

import streamlit as st
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build

os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"
CREDENTIALS_STR = os.environ.get("CREDENTIALS")

# OAuth2.0 client configuration
CLIENT_SECRETS_FILE = "./credentials.json"
SCOPES = [
    "https://www.googleapis.com/auth/webmasters.readonly",
    "https://www.googleapis.com/auth/webmasters",
]
REDIRECT_URI = os.environ.get("REDIRECT_URI", "https://smoothindex.streamlit.app/")


def get_flow_worker():
    try:
        flow = Flow.from_client_secrets_file(
            CLIENT_SECRETS_FILE, scopes=SCOPES, redirect_uri=REDIRECT_URI
        )
        return flow
    except Exception as e:
        credentials = json.loads(CREDENTIALS_STR)
        return Flow.from_client_config(credentials, scopes=SCOPES)


# Function to authenticate and create a service
def authenticate_gsc():
    try:
        # If there are no credentials, initialize the flow
        if (
            "credentials" not in st.session_state
            or st.session_state["credentials"] is None
        ):
            flow = get_flow_worker()

            authorization_url, state = flow.authorization_url(access_type="offline")
            st.session_state["flow"] = flow
            st.session_state["authorization_url"] = authorization_url
            return None
        else:
            # Load credentials from session state
            credentials = pickle.loads(st.session_state["credentials"])
            print("Loading credentials from session state ---------------------")
            if credentials.expired and credentials.refresh_token:
                credentials.refresh(Request())
            return build("webmasters", "v3", credentials=credentials)
    except Exception as e:
        st.error(f"An error occurred: {e}")
        return None


# Function to fetch domains from Google Search Console
def get_domains(service):
    sites = service.sites().list().execute()
    return [site["siteUrl"] for site in sites.get("siteEntry", [])]


# Main Streamlit app layout
def main():
    st.title("Google Search Console Domains")

    # Initialize session state
    if "credentials" not in st.session_state:
        st.session_state["credentials"] = None
    if "flow" not in st.session_state:
        st.session_state["flow"] = None
    if "authorization_url" not in st.session_state:
        st.session_state["authorization_url"] = None

    # Login button
    if st.session_state["credentials"] is None:
        if st.button("Login with Google"):
            service = authenticate_gsc()
            if service is None:
                st.write(
                    f"[Click here to log in]({st.session_state['authorization_url']})"
                )
                return

    # Handle OAuth callback
    if "code" in st.query_params:
        flow = st.session_state["flow"]
        print("st.session_state", st.session_state)
        if (
            "credentials" in st.session_state
            and st.session_state["credentials"] is not None
        ):
            pass
        else:
            if flow == None:
                flow = get_flow_worker()
            # print(flow.credentials, flow.authorization_url)
            flow.fetch_token(code=st.query_params["code"])
            credentials = flow.credentials
            st.session_state["credentials"] = pickle.dumps(credentials)
            print("ST Session State ===============", st.session_state)
            st.query_params.clear()
            st.rerun()

    # Fetch domains
    try:
        service = authenticate_gsc()
        if service is None:
            return
        domains = get_domains(service)
        if domains:
            st.success("Domains fetched successfully!")
            st.write(domains)
        else:
            st.warning("No domains found.")
    except Exception as e:
        st.error(f"An error occurred: {e}")


if __name__ == "__main__":
    print(
        """

    
    Running the app
    
    
    
    
    
    
    
    """
    )
    main()
