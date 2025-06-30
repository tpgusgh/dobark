from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.api import api_router
from app.database.database import engine
from app.models import user, game, inquiry

# Create database tables
user.Base.metadata.create_all(bind=engine)
game.Base.metadata.create_all(bind=engine)
inquiry.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Gambling Platform API",
    description="Backend API for the gambling platform with snail racing game",
    version="1.0.0"
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "Gambling Platform API is running!"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}