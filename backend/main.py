from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from pydantic import BaseModel
from database import SessionLocal, engine
from models import Base, User,Task
from schemas import TaskCreate, TaskUpdate,SignupRequest,LoginRequest,TaskSummary
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Path
from typing import List
from dotenv import load_dotenv
import os
from transformers import pipeline

# Create the database tables
Base.metadata.create_all(bind=engine)

app = FastAPI()
# Faster, lightweight model (T5-small)
summarizer = pipeline("summarization", model="t5-small")
# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class TaskSummaryRequest(BaseModel):
    tasks: list[str]


# -------------------------------
# Signup Route
# -------------------------------
@app.post("/signup")
def signup(request: SignupRequest, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.phone == request.phone).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Phone number already registered")

    hashed_password = pwd_context.hash(request.password)
    user = User(name=request.name, phone=request.phone, password=hashed_password)
    db.add(user)
    db.commit()
    db.refresh(user)
    return {
        "message": "User registered successfully",
        "user": {
            "name": user.name,
            "phone": user.phone
        }
    }

# -------------------------------
# Login Route
# -------------------------------
@app.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.name == request.name).first()
    if not user:
        raise HTTPException(status_code=400, detail="User not found")

    if not pwd_context.verify(request.password, user.password):
        raise HTTPException(status_code=400, detail="Incorrect password")

    return {
        "message": "Login successful",
        "user": {
            "name": user.name,
            "phone": user.phone
        }
    }
@app.post("/tasks/{username}")
def create_task(username: str, task: TaskCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.name == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    new_task = Task(**task.dict(), user_id=user.id)
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return {"message": "Task created", "task": new_task.id}


@app.get("/tasks/{username}")
def get_tasks(username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.name == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    tasks = db.query(Task).filter(Task.user_id == user.id).all()
    return [serialize_task(task) for task in tasks]


@app.patch("/tasks/{task_id}")
def update_task(task_id: int, request: TaskUpdate, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    update_data = request.dict(exclude_unset=True)  # ✅ Only update what's sent

    for key, value in update_data.items():
        setattr(task, key, value)

    db.commit()
    db.refresh(task)

    return {"message": "Task updated", "task": serialize_task(task)}

def serialize_task(task):
    from datetime import datetime, time, date

    def safe_format(value, fmt):
        if isinstance(value, (datetime, date, time)):
            return value.strftime(fmt)
        return value  # If it's already a string or None

    return {
        "id": task.id,
        "title": task.title,
        "description": task.description,
        "priority": task.priority,
        "due_date": safe_format(task.due_date, "%Y-%m-%d"),
        "due_time": safe_format(task.due_time, "%H:%M"),
        "category": task.category,
        "completed": task.completed,
        "completed_at": task.completed_at,
        "user_id": task.user_id
    }




@app.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db.delete(task)
    db.commit()
    return {"message": "Task deleted successfully"}


@app.get("/ai/summary/{username}")
def get_summary(username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.name == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    tasks = db.query(Task).filter(Task.user_id == user.id).all()
    if not tasks:
        return {"summary": "No tasks available to summarize."}

    text = " ".join([
    f"{task.title}: {task.description}" if task.description else task.title
    for task in tasks
])

    # Summarize only if text is long enough
    if len(text) < 20:
        return {"summary": "Not enough task content to summarize."}
    if len(text) > 1000:
        text = text[:1000]
    result = summarizer(text, max_length=60, min_length=20, do_sample=False)
    return {"summary": result[0]['summary_text']}