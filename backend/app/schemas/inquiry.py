from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.models.inquiry import InquiryStatus

class InquiryBase(BaseModel):
    title: str
    content: str

class InquiryCreate(InquiryBase):
    pass

class InquiryUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    status: Optional[InquiryStatus] = None
    response: Optional[str] = None

class Inquiry(InquiryBase):
    id: int
    user_id: int
    status: InquiryStatus
    response: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    username: Optional[str] = None

    class Config:
        from_attributes = True