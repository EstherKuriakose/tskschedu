from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from pydantic import BaseModel
from database import SessionLocal, engine
from models import Base, User,Task
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Path

# Create the database tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000","http://localhost:3001","http://localhost:3002"],
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

# -------------------------------
# Pydantic Schemas
# -------------------------------

class SignupRequest(BaseModel):
    name: str
    phone: str
    password: str

class LoginRequest(BaseModel):
    name: str
    password: str
class TaskBase(BaseModel):
    title: str
    description: str = ""
    priority: str
    due_date: str
    due_time: str
    category: str
class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    completed: bool
    completed_at: str | None = None
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
def update_task_status(task_id: int, request: TaskUpdate, db: Session = Depends(get_db)):
    print(f"🛠️ Updating task {task_id} with data: {request.dict(exclude_unset=True)}")

    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        print("❌ Task not found")
        raise HTTPException(status_code=404, detail="Task not found")

    if request.completed is not None:
        task.completed = request.completed
    if request.completed_at is not None:
        task.completed_at = request.completed_at

    # ✅ Add this block to update other fields if needed
    update_data = request.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(task, field, value)

    db.commit()
    db.refresh(task)
    print(f"✅ Task {task_id} updated")
    return {"message": "Task status updated", "task": serialize_task(task)}

def serialize_task(task):
    return {
        "id": task.id,
        "title": task.title,
        "description": task.description,
        "priority": task.priority,
        "due_date": task.due_date,
        "due_time": task.due_time,
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

