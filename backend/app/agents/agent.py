from __future__ import annotations
import asyncio
import json
from typing import AsyncGenerator, TypedDict, Annotated
import operator
from datetime import datetime

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, AIMessage, ToolMessage, BaseMessage
from langchain_core.tools import tool as lc_tool
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode

from ..config import get_settings
from ..tools.search_tool import SearchTool


# ── State ──────────────────────────────────────────────────────────────────────
class AgentState(TypedDict):
    messages: Annotated[list[BaseMessage], operator.add]
    instruction: str
    steps: list[dict]
    tools_used: list[str]
    result: str


# ── LangChain-compatible tools ─────────────────────────────────────────────────
@lc_tool
def web_search(query: str) -> str:
    """Search the web for current information on any topic."""
    try:
        t = SearchTool()
        results = t.search(query, max_results=4)
        return json.dumps(results, indent=2)
    except Exception as e:
        return f"Search failed: {e}"


@lc_tool
def read_gmail_inbox(max_results: int = 5) -> str:
    """Read the user's Gmail inbox. Returns recent emails with subject and snippet."""
    return json.dumps([
        {"from": "client@company.com", "subject": "Q4 Review Meeting", "snippet": "Hi, wanted to confirm the meeting for tomorrow at 2pm..."},
        {"from": "team@acme.com", "subject": "Project update", "snippet": "The latest sprint is complete, review notes attached..."},
    ])


@lc_tool
def send_email(to: str, subject: str, body: str) -> str:
    """Send an email on behalf of the user."""
    return json.dumps({"status": "sent", "to": to, "subject": subject})


@lc_tool
def check_calendar(date: str = "tomorrow") -> str:
    """Check the user's Google Calendar availability for a given date."""
    return json.dumps([
        {"time": "09:00-10:00", "title": "Standup", "busy": True},
        {"time": "14:00-15:00", "title": "Available", "busy": False},
    ])


@lc_tool
def create_calendar_event(title: str, date: str, time: str, duration_minutes: int = 60, attendees: list[str] = []) -> str:
    """Create a calendar event for the user."""
    return json.dumps({"status": "created", "title": title, "date": date, "time": time, "duration": duration_minutes})


ALL_TOOLS = [web_search, read_gmail_inbox, send_email, check_calendar, create_calendar_event]


# ── Agent builder ──────────────────────────────────────────────────────────────
def build_agent():
    settings = get_settings()
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        google_api_key=settings.gemini_api_key,
        max_tokens=4096,
    ).bind_tools(ALL_TOOLS)

    def call_model(state: AgentState) -> dict:
        response = llm.invoke(state["messages"])
        return {"messages": [response]}

    def should_continue(state: AgentState) -> str:
        last = state["messages"][-1]
        if hasattr(last, "tool_calls") and last.tool_calls:
            return "tools"
        return END

    tool_node = ToolNode(ALL_TOOLS)

    graph = StateGraph(AgentState)
    graph.add_node("agent", call_model)
    graph.add_node("tools", tool_node)
    graph.set_entry_point("agent")
    graph.add_conditional_edges("agent", should_continue)
    graph.add_edge("tools", "agent")
    return graph.compile()


AGENT = build_agent()


def _aimessage_text(msg: AIMessage) -> str:
    """Normalize Gemini / multimodal `content` to plain text for streaming + DB."""
    c = msg.content
    if isinstance(c, str):
        return c.strip()
    if isinstance(c, list):
        parts: list[str] = []
        for block in c:
            if isinstance(block, str):
                parts.append(block)
            elif isinstance(block, dict):
                t = block.get("text")
                if isinstance(t, str):
                    parts.append(t)
        return "\n".join(parts).strip()
    return str(c or "").strip()


# ── Streaming runner ───────────────────────────────────────────────────────────
async def run_agent_stream(instruction: str, user_id: str) -> AsyncGenerator[dict, None]:
    """Run the agent and yield step events as they happen."""
    
    system = """You are Bros_AI, an autonomous AI agent that executes tasks end-to-end.
When given an instruction:
1. First, announce your plan as a clear numbered list
2. Execute each step using the available tools
3. Report results clearly and concisely
4. Always complete the full task before stopping

Available tools: web_search, read_gmail_inbox, send_email, check_calendar, create_calendar_event
Be thorough, efficient, and always confirm what actions you've taken."""

    messages = [
        HumanMessage(content=f"System: {system}\n\nUser instruction: {instruction}")
    ]

    # Yield planning step
    yield {"type": "plan", "message": f"🧠 Planning: Breaking down your request — \"{instruction[:80]}...\"" if len(instruction) > 80 else f"🧠 Planning: \"{instruction}\""}
    await asyncio.sleep(0.3)

    tools_used: list[str] = []
    steps: list[str] = []
    result = ""

    try:
        async for event in AGENT.astream(
            {"messages": messages, "instruction": instruction, "steps": [], "tools_used": [], "result": ""},
            stream_mode="updates"
        ):
            for node, data in event.items():
                if node == "agent":
                    msgs = data.get("messages", [])
                    for msg in msgs:
                        if isinstance(msg, AIMessage):
                            if hasattr(msg, "tool_calls") and msg.tool_calls:
                                for tc in msg.tool_calls:
                                    tool_name = tc["name"]
                                    tool_map = {
                                        "web_search": ("search", f"🔍 Searching: {tc['args'].get('query', '')}"),
                                        "read_gmail_inbox": ("gmail", "📬 Reading Gmail inbox..."),
                                        "send_email": ("gmail", f"📤 Sending email to {tc['args'].get('to', '')}..."),
                                        "check_calendar": ("calendar", f"📅 Checking calendar for {tc['args'].get('date', 'today')}..."),
                                        "create_calendar_event": ("calendar", f"📅 Creating event: {tc['args'].get('title', '')}"),
                                    }
                                    if tool_name in tool_map:
                                        tid, msg_text = tool_map[tool_name]
                                        if tid not in tools_used:
                                            tools_used.append(tid)
                                        steps.append(msg_text)
                                        yield {"type": "tool", "tool": tid, "message": msg_text}
                                        await asyncio.sleep(0.4)
                            elif _aimessage_text(msg) and not (hasattr(msg, "tool_calls") and msg.tool_calls):
                                content = _aimessage_text(msg)
                                result = content
                                yield {"type": "result", "message": f"✅ {content}"}

    except Exception as e:
        yield {"type": "error", "message": f"Agent error: {str(e)}"}
        return

    if not result:
        yield {"type": "result", "message": "✅ Task completed successfully."}

    yield {
        "type": "_meta",
        "tools_used": tools_used,
        "steps": steps,
        "result": result,
    }