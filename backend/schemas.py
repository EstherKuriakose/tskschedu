from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# -----------------------------
# User-related Schemas
# -----------------------------
class UserCreate(BaseModel):
    name: str
    phone: str
    password: str

class UserLogin(BaseModel):
    phone: str
    password: str

# -----------------------------
# Task-related Schemas
# -----------------------------

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = ""
    priority: str
    due_date: Optional[str] = ""
    due_time: Optional[str] = ""
    category: str

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    due_date: Optional[str] = None
    due_time: Optional[str] = None
    category: Optional[str] = None
    completed: Optional[bool] = None
    completed_at: Optional[datetime] = None

class TaskResponse(TaskBase):
    id: int
    completed: bool
    created_at: datetime
    completed_at: Optional[datetime]

    class Config:
        orm_mode = True  # To support SQLAlchemy model conversion
