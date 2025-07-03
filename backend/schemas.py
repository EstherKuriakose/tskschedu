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
    completed: bool
    completed_at: Optional[datetime] = None

class TaskResponse(TaskBase):
    id: int
    completed: bool
    created_at: datetime
    completed_at: Optional[datetime]

    class Config:
        orm_mode = True  # To support SQLAlchemy model conversion
