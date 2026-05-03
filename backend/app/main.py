from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import get_settings
from .api.tasks import router as tasks_router
from .api.integrations import router as integrations_router

settings = get_settings()

app = FastAPI(
    title="Bros_AI API",
    description="Autonomous AI agent backend",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tasks_router)
app.include_router(integrations_router)


@app.get("/")
def root():
    return {"status": "ok", "service": "Bros_AI API", "version": "1.0.0"}


@app.get("/health")
def health():
    return {"status": "healthy"}
