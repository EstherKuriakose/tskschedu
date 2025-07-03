from sqlalchemy import Column, Integer, String,Boolean,DateTime,ForeignKey
from database import Base
from sqlalchemy.orm import relationship
from datetime import datetime
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    phone = Column(String, unique=True, index=True)
    password = Column(String, nullable=False)

class Task(Base):
    __tablename__ = 'tasks'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String)
    priority = Column(String)
    due_date = Column(String)
    due_time = Column(String)
    category = Column(String)
    completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    user_id = Column(Integer, ForeignKey('users.id'))
    user = relationship("User", back_populates="tasks")

# Update User model
User.tasks = relationship("Task", back_populates="user", cascade="all, delete-orphan")