🛠️ Setup Steps (Frontend + Backend)
--------------------------------------------
1.To set up the **backend**, navigate to the `backend` folder, create a virtual environment using `python -m venv env`, and activate it (`source env/bin/activate` for Mac/Linux or `env\Scripts\activate` for Windows). Then install all dependencies using `pip install -r requirements.txt`. Start the FastAPI server using `uvicorn main:app --reload`. The backend will now run at `http://localhost:8000`.
2. To set up the **frontend**, go to the `frontend` folder and run `npm install` to install all required packages. Once the installation is complete, use `npm start` to launch the React development server. The frontend will be accessible at `http://localhost:3000`.

--------------------------------------------
✅ Feature List
1.User Authentication: Allows users to sign up and log in securely.
2.CRUD Operations: Users can create, update, delete, and view tasks.
3.Task Status Tracking: Tasks can be marked as completed or pending.
4.Checkpoints: Each task supports progress tracking through checkpoints.
5.Drag-and-Drop Reordering: Users can reorder tasks via a simple drag-and-drop interface.
6.Calendar View: Tasks are displayed on a calendar for better scheduling.
7.AI Assistant: Summarizes tasks and suggests priorities using AI.
8.Task Filtering: Tasks can be filtered by category, status, or priority.
9.Persistent Storage: All user data and tasks are stored in a database (SQLite/PostgreSQL).
10.Responsive Design: Built with React and Tailwind CSS for smooth use on all screen sizes.
11.Duplicate task detection:A task duplicate cannot be added
