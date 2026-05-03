from __future__ import annotations
import asyncio
import json
import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from ..auth import get_current_user, get_current_user_from_query
from ..db import get_supabase
from ..agents.agent import run_agent_stream

router = APIRouter(prefix="/api/tasks", tags=["tasks"])

# In-memory task store (in production, use Redis)
_task_store: dict[str, dict] = {}


class RunRequest(BaseModel):
    instruction: str


@router.post("/run")
async def start_task(body: RunRequest, user: dict = Depends(get_current_user)):
    task_id = str(uuid.uuid4())
    _task_store[task_id] = {
        "user_id": user["id"],
        "instruction": body.instruction,
        "status": "pending",
        "started_at": datetime.utcnow().isoformat(),
    }

    # Save initial record to Supabase
    try:
        db = get_supabase()
        db.table("task_history").insert({
            "id": task_id,
            "user_id": user["id"],
            "instruction": body.instruction,
            "status": "pending",
            "steps": [],
            "tools_used": [],
            "result": None,
        }).execute()
    except Exception:
        pass  # DB write failures don't block the task

    return {"task_id": task_id}


@router.get("/{task_id}/stream")
async def stream_task(
    task_id: str,
    token: str = Query(...),
):
    user = await get_current_user_from_query(token)
    task = _task_store.get(task_id)
    if not task:
        raise HTTPException(404, "Task not found")
    if task["user_id"] != user["id"]:
        raise HTTPException(403, "Forbidden")

    async def event_generator():
        instruction = task["instruction"]
        steps: list[str] = []
        tools_used: list[str] = []
        result = ""
        start_time = datetime.utcnow()

        try:
            async for event in run_agent_stream(instruction, user["id"]):
                if event.get("type") == "_meta":
                    # Internal metadata — don't send to client
                    tools_used = event.get("tools_used", [])
                    steps = event.get("steps", [])
                    result = event.get("result", "")
                    continue

                payload = json.dumps(event)
                yield f"data: {payload}\n\n"
                await asyncio.sleep(0.05)

        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"

        finally:
            # Save completed task to DB
            duration = int((datetime.utcnow() - start_time).total_seconds())
            try:
                db = get_supabase()
                db.table("task_history").update({
                    "status": "completed",
                    "steps": steps,
                    "tools_used": tools_used,
                    "result": result,
                    "duration_seconds": duration,
                }).eq("id", task_id).execute()
            except Exception:
                pass

            yield "event: done\ndata: done\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive",
        },
    )


@router.get("/")
async def list_tasks(user: dict = Depends(get_current_user)):
    try:
        db = get_supabase()
        result = db.table("task_history").select("*").eq("user_id", user["id"]).order("created_at", desc=True).limit(20).execute()
        return result.data
    except Exception as e:
        raise HTTPException(500, str(e))
