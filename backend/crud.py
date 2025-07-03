from sqlalchemy.orm import Session
from models import User, Task
from schemas import UserCreate, TaskCreate, TaskUpdate
from datetime import datetime

# -----------------------------
# USER CRUD FUNCTIONS
# -----------------------------

def create_user(db: Session, user: UserCreate):
    db_user = User(name=user.name, phone=user.phone, password=user.password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_phone(db: Session, phone: str):
    return db.query(User).filter(User.phone == phone).first()

# -----------------------------
# TASK CRUD FUNCTIONS
# -----------------------------

def create_task(db: Session, task_data: TaskCreate, user_id: int):
    task = Task(
        user_id=user_id,
        title=task_data.title,
        description=task_data.description,
        priority=task_data.priority,
        due_date=task_data.due_date,
        due_time=task_data.due_time,
        category=task_data.category,
        completed=False,
        created_at=datetime.utcnow(),
        completed_at=None
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

def get_tasks_for_user(db: Session, user_id: int):
    return db.query(Task).filter(Task.user_id == user_id).all()

def update_task_status(db: Session, task_id: int, update_data: TaskUpdate):
    task = db.query(Task).filter(Task.id == task_id).first()
    if task:
        task.completed = update_data.completed
        task.completed_at = update_data.completed_at
        db.commit()
        db.refresh(task)
    return task

def delete_task(db: Session, task_id: int):
    task = db.query(Task).filter(Task.id == task_id).first()
    if task:
        db.delete(task)
        db.commit()
    return task
