from __future__ import annotations
import os
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import RedirectResponse
from google_auth_oauthlib.flow import Flow
from ..auth import get_current_user
from ..db import get_supabase
from ..config import get_settings

router = APIRouter(prefix="/api/integrations", tags=["integrations"])

GOOGLE_SCOPES = [
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.send",
    "https://www.googleapis.com/auth/calendar",
    "openid", "email", "profile",
]


def _make_flow(state: str = "") -> Flow:
    s = get_settings()
    return Flow.from_client_config(
        {
            "web": {
                "client_id": s.google_client_id,
                "client_secret": s.google_client_secret,
                "redirect_uris": [s.google_redirect_uri],
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
            }
        },
        scopes=GOOGLE_SCOPES,
        redirect_uri=s.google_redirect_uri,
        state=state,
    )


@router.get("/gmail/auth")
@router.get("/google_calendar/auth")
@router.get("/google/auth")
async def google_auth(user: dict = Depends(get_current_user)):
    """Start Google OAuth flow."""
    flow = _make_flow(state=user["id"])
    auth_url, _ = flow.authorization_url(
        access_type="offline",
        include_granted_scopes="true",
        prompt="consent",
    )
    return {"auth_url": auth_url}


@router.get("/google/callback")
async def google_callback(code: str = Query(...), state: str = Query(...)):
    """Handle Google OAuth callback."""
    user_id = state
    flow = _make_flow(state=state)
    try:
        os.environ["OAUTHLIB_RELAX_TOKEN_SCOPE"] = "1"
        os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"
        flow.fetch_token(code=code)
        creds = flow.credentials
    except Exception as e:
        raise HTTPException(400, f"OAuth failed: {e}")

    db = get_supabase()
    settings = get_settings()

    # Save tokens for both gmail and calendar
    for provider in ["gmail", "google_calendar"]:
        existing = db.table("user_integrations").select("id").eq("user_id", user_id).eq("provider", provider).execute()
        data = {
            "user_id": user_id,
            "provider": provider,
            "access_token": creds.token,
            "refresh_token": creds.refresh_token,
            "expires_at": creds.expiry.isoformat() if creds.expiry else None,
            "connected": True,
        }
        if existing.data:
            db.table("user_integrations").update(data).eq("user_id", user_id).eq("provider", provider).execute()
        else:
            db.table("user_integrations").insert(data).execute()

    return RedirectResponse(url=f"{settings.frontend_url}/dashboard/integrations?connected=google")


@router.get("/")
async def list_integrations(user: dict = Depends(get_current_user)):
    db = get_supabase()
    result = db.table("user_integrations").select("provider,connected,expires_at").eq("user_id", user["id"]).execute()
    return result.data