import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

export default function PersonalCategoryPage() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:8000/tasks/${user.name}`)
        .then(res => res.json())
        .then(data => {
          const personalTasks = data.filter(task => task.category === 'personal');
          setTasks(personalTasks);
        })
        .catch(err => console.error("Error fetching personal tasks:", err));
    }
  }, [user]);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <Navbar />
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "1rem", color: "#3b82f6" }}>
        Personal Category Tasks
      </h1>

      {tasks.length === 0 ? (
        <p>No personal tasks found.</p>
      ) : (
        <ul style={{ padding: 0, listStyle: "none" }}>
          {tasks.map(task => (
            <li key={task.id} style={{
              border: "1px solid #ccc",
              padding: "1rem",
              borderRadius: "8px",
              marginBottom: "1rem",
              backgroundColor: "#eff6ff"
            }}>
              <h3 style={{ margin: 0 }}>{task.title}</h3>
              <p>{task.description}</p>
              <p><strong>Due:</strong> {task.due_date} {task.due_time && `at ${task.due_time}`}</p>
              <p><strong>Priority:</strong> {task.priority}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
