import httpx
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError, ExpiredSignatureError
from .config import get_settings

bearer = HTTPBearer(auto_error=False)

_jwks_cache: dict | None = None

async def _get_jwks() -> dict:
    global _jwks_cache
    if _jwks_cache:
        return _jwks_cache
    s = get_settings()
    url = f"{s.supabase_url}/auth/v1/.well-known/jwks.json"
    async with httpx.AsyncClient() as client:
        resp = await client.get(url)
        resp.raise_for_status()
        _jwks_cache = resp.json()
    return _jwks_cache

async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer),
) -> dict:
    if not credentials:
        raise HTTPException(status_code=401, detail="No token provided")
    return await _verify_token(credentials.credentials)

async def get_current_user_from_query(token: str) -> dict:
    """For SSE connections that pass token as query param."""
    return await _verify_token(token)

async def _verify_token(token: str) -> dict:
    s = get_settings()
    # Try ES256 via JWKS first (current Supabase ECC key)
    try:
        jwks = await _get_jwks()
        header = jwt.get_unverified_header(token)
        key_id = header.get("kid")
        key = next((k for k in jwks.get("keys", []) if k.get("kid") == key_id), None)
        if key:
            payload = jwt.decode(
                token,
                key,
                algorithms=["ES256", "RS256"],
                options={"verify_aud": False},
            )
            user_id = payload.get("sub")
            email = payload.get("email")
            if user_id:
                return {"id": user_id, "email": email, "token": token}
    except (JWTError, ExpiredSignatureError, Exception):
        pass

    # Fallback: HS256 with legacy JWT secret
    try:
        if s.supabase_jwt_secret:
            payload = jwt.decode(
                token,
                s.supabase_jwt_secret,
                algorithms=["HS256"],
                options={"verify_aud": False},
            )
            user_id = payload.get("sub")
            email = payload.get("email")
            if user_id:
                return {"id": user_id, "email": email, "token": token}
    except (JWTError, ExpiredSignatureError):
        pass

    raise HTTPException(status_code=401, detail="Token verification failed")