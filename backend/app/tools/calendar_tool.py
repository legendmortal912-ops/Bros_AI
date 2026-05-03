from __future__ import annotations
from datetime import datetime, timedelta
from typing import Any
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from .base import BaseTool


class CalendarTool(BaseTool):
    name = "calendar"

    def __init__(self, access_token: str):
        self.creds = Credentials(token=access_token)
        self.service = build("calendar", "v3", credentials=self.creds)

    def list_events(self, max_results: int = 5) -> list[dict]:
        now = datetime.utcnow().isoformat() + "Z"
        events = self.service.events().list(
            calendarId="primary", timeMin=now,
            maxResults=max_results, singleEvents=True,
            orderBy="startTime"
        ).execute()
        return [
            {
                "id": e["id"],
                "summary": e.get("summary", "No title"),
                "start": e["start"].get("dateTime", e["start"].get("date")),
                "end": e["end"].get("dateTime", e["end"].get("date")),
                "attendees": [a["email"] for a in e.get("attendees", [])],
            }
            for e in events.get("items", [])
        ]

    def create_event(self, title: str, start: str, end: str | None = None, attendees: list[str] | None = None, description: str = "") -> dict:
        start_dt = datetime.fromisoformat(start)
        end_dt = datetime.fromisoformat(end) if end else start_dt + timedelta(hours=1)
        body: dict = {
            "summary": title,
            "description": description,
            "start": {"dateTime": start_dt.isoformat(), "timeZone": "UTC"},
            "end": {"dateTime": end_dt.isoformat(), "timeZone": "UTC"},
        }
        if attendees:
            body["attendees"] = [{"email": a} for a in attendees]
        event = self.service.events().insert(calendarId="primary", body=body).execute()
        return {"id": event["id"], "htmlLink": event.get("htmlLink"), "status": "created"}

    def check_availability(self, date: str) -> list[dict]:
        """Check free/busy for a given date."""
        start = datetime.fromisoformat(date).replace(hour=0, minute=0, second=0).isoformat() + "Z"
        end = datetime.fromisoformat(date).replace(hour=23, minute=59, second=59).isoformat() + "Z"
        body = {"timeMin": start, "timeMax": end, "items": [{"id": "primary"}]}
        result = self.service.freebusy().query(body=body).execute()
        busy = result["calendars"]["primary"]["busy"]
        return busy

    def run(self, action: str, **kwargs: Any) -> Any:
        if action == "list_events":
            return self.list_events(**kwargs)
        elif action == "create_event":
            return self.create_event(**kwargs)
        elif action == "check_availability":
            return self.check_availability(**kwargs)
        else:
            raise ValueError(f"Unknown Calendar action: {action}")
