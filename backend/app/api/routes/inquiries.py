from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database.database import get_db
from app.models.user import User
from app.models.inquiry import Inquiry
from app.schemas.inquiry import InquiryCreate, InquiryUpdate, Inquiry as InquirySchema
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/", response_model=InquirySchema)
def create_inquiry(
    inquiry: InquiryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_inquiry = Inquiry(
        user_id=current_user.id,
        title=inquiry.title,
        content=inquiry.content
    )
    
    db.add(db_inquiry)
    db.commit()
    db.refresh(db_inquiry)
    
    # Add username to response
    result = InquirySchema.from_orm(db_inquiry)
    result.username = current_user.username
    
    return result

@router.get("/", response_model=List[InquirySchema])
def get_inquiries(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    inquiries = db.query(Inquiry).filter(
        Inquiry.user_id == current_user.id
    ).order_by(Inquiry.created_at.desc()).offset(skip).limit(limit).all()
    
    # Add username to each inquiry
    result = []
    for inquiry in inquiries:
        inquiry_dict = InquirySchema.from_orm(inquiry)
        inquiry_dict.username = current_user.username
        result.append(inquiry_dict)
    
    return result

@router.get("/{inquiry_id}", response_model=InquirySchema)
def get_inquiry(
    inquiry_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    inquiry = db.query(Inquiry).filter(
        Inquiry.id == inquiry_id,
        Inquiry.user_id == current_user.id
    ).first()
    
    if not inquiry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inquiry not found"
        )
    
    result = InquirySchema.from_orm(inquiry)
    result.username = current_user.username
    
    return result

@router.put("/{inquiry_id}", response_model=InquirySchema)
def update_inquiry(
    inquiry_id: int,
    inquiry_update: InquiryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    inquiry = db.query(Inquiry).filter(
        Inquiry.id == inquiry_id,
        Inquiry.user_id == current_user.id
    ).first()
    
    if not inquiry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inquiry not found"
        )
    
    update_data = inquiry_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(inquiry, field, value)
    
    db.commit()
    db.refresh(inquiry)
    
    result = InquirySchema.from_orm(inquiry)
    result.username = current_user.username
    
    return result

@router.delete("/{inquiry_id}")
def delete_inquiry(
    inquiry_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    inquiry = db.query(Inquiry).filter(
        Inquiry.id == inquiry_id,
        Inquiry.user_id == current_user.id
    ).first()
    
    if not inquiry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inquiry not found"
        )
    
    db.delete(inquiry)
    db.commit()
    
    return {"message": "Inquiry deleted successfully"}