from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import random
from app.database.database import get_db
from app.models.user import User
from app.models.game import GameResult
from app.schemas.game import GamePlay, GameResult as GameResultSchema
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/play", response_model=GameResultSchema)
def play_snail_race(
    game_data: GamePlay,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check if user has enough balance
    if current_user.balance < game_data.bet_amount:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient balance"
        )
    
    # Validate selected snail
    if game_data.selected_snail not in [1, 2]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Selected snail must be 1 or 2"
        )
    
    # Simulate race (random winner)
    winner_snail = random.choice([1, 2])
    is_win = winner_snail == game_data.selected_snail
    win_amount = game_data.bet_amount * 2 if is_win else 0
    
    # Update user balance
    if is_win:
        current_user.balance += game_data.bet_amount
    else:
        current_user.balance -= game_data.bet_amount
    
    # Create game result
    game_result = GameResult(
        user_id=current_user.id,
        bet_amount=game_data.bet_amount,
        selected_snail=game_data.selected_snail,
        winner_snail=winner_snail,
        win_amount=win_amount,
        is_win=is_win
    )
    
    db.add(game_result)
    db.commit()
    db.refresh(game_result)
    
    return game_result

@router.get("/history", response_model=List[GameResultSchema])
def get_game_history(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    games = db.query(GameResult).filter(
        GameResult.user_id == current_user.id
    ).order_by(GameResult.created_at.desc()).offset(skip).limit(limit).all()
    
    return games