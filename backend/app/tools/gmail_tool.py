from __future__ import annotations
import base64
from typing import Any
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from .base import BaseTool


class GmailTool(BaseTool):
    name = "gmail"

    def __init__(self, access_token: str):
        self.creds = Credentials(token=access_token)
        self.service = build("gmail", "v1", credentials=self.creds)

    def read_inbox(self, max_results: int = 5) -> list[dict]:
        results = self.service.users().messages().list(
            userId="me", labelIds=["INBOX"], maxResults=max_results
        ).execute()
        messages = results.get("messages", [])
        emails = []
        for m in messages:
            msg = self.service.users().messages().get(
                userId="me", id=m["id"], format="metadata",
                metadataHeaders=["From", "Subject", "Date"]
            ).execute()
            headers = {h["name"]: h["value"] for h in msg["payload"]["headers"]}
            snippet = msg.get("snippet", "")
            emails.append({
                "id": m["id"],
                "from": headers.get("From", ""),
                "subject": headers.get("Subject", ""),
                "date": headers.get("Date", ""),
                "snippet": snippet,
            })
        return emails

    def send_email(self, to: str, subject: str, body: str) -> dict:
        msg_bytes = f"To: {to}\nSubject: {subject}\n\n{body}".encode()
        encoded = base64.urlsafe_b64encode(msg_bytes).decode()
        result = self.service.users().messages().send(
            userId="me", body={"raw": encoded}
        ).execute()
        return {"id": result["id"], "status": "sent"}

    def draft_reply(self, original_id: str, body: str) -> dict:
        """Draft a reply to an existing email."""
        original = self.service.users().messages().get(
            userId="me", id=original_id, format="metadata",
            metadataHeaders=["From", "Subject", "Message-ID"]
        ).execute()
        headers = {h["name"]: h["value"] for h in original["payload"]["headers"]}
        to = headers.get("From", "")
        subject = "Re: " + headers.get("Subject", "")
        return self.send_email(to, subject, body)

    def run(self, action: str, **kwargs: Any) -> Any:
        if action == "read_inbox":
            return self.read_inbox(**kwargs)
        elif action == "send_email":
            return self.send_email(**kwargs)
        elif action == "draft_reply":
            return self.draft_reply(**kwargs)
        else:
            raise ValueError(f"Unknown Gmail action: {action}")
