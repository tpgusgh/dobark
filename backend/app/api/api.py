from fastapi import APIRouter
from app.api.routes import auth, users, games, inquiries

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(games.router, prefix="/games", tags=["games"])
api_router.include_router(inquiries.router, prefix="/inquiries", tags=["inquiries"])