from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database.database import Base

class GameResult(Base):
    __tablename__ = "game_results"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    game_type = Column(String, default="snail-race")
    bet_amount = Column(Float, nullable=False)
    selected_snail = Column(Integer, nullable=False)  # 1 or 2
    winner_snail = Column(Integer, nullable=False)    # 1 or 2
    win_amount = Column(Float, default=0.0)
    is_win = Column(Boolean, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")