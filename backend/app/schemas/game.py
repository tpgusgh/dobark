from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class GameResultBase(BaseModel):
    bet_amount: float
    selected_snail: int

class GameResultCreate(GameResultBase):
    pass

class GameResult(GameResultBase):
    id: int
    user_id: int
    game_type: str
    winner_snail: int
    win_amount: float
    is_win: bool
    created_at: datetime

    class Config:
        from_attributes = True

class GamePlay(BaseModel):
    bet_amount: float
    selected_snail: int