import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

export default function OverduePage() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [overdueTasks, setOverdueTasks] = useState([]);

  // Define category color codes
  const categoryColors = {
    personal: '#3b82f6',
    work: '#f97316',
    shopping: '#16a34a',
    health: '#dc2626',
    other: '#6366f1'
  };

useEffect(() => {
  if (user) {
    fetch(`http://localhost:8000/tasks/${user.name}`)
      .then(res => res.json())
      .then(data => {
        const now = new Date();

        const overdue = data.filter(task => {
          if (task.completed) return false;

          // SAFELY extract date & time parts
          const dueDateStr = task.due_date || '';
          const dueTimeStr = task.due_time || '23:59';  // default if missing

          // Build local datetime object
          const [year, month, day] = dueDateStr.split('-').map(Number);
          const [hour, minute] = dueTimeStr.split(':').map(Number);

          // Construct due date in LOCAL TIME
          const dueDateTime = new Date(year, month - 1, day, hour, minute);

          // Debug
          console.log(`🧾 Task: ${task.title}, Due: ${dueDateTime}, Now: ${now}`);

          return dueDateTime < now;
        });

        setOverdueTasks(overdue);
      })
      .catch(err => console.error("Error fetching tasks:", err));
  }
}, [user]);



  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <Navbar />
      <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "#dc2626", marginBottom: "1.5rem" }}>
        Overdue Tasks
      </h1>

      {overdueTasks.length === 0 ? (
        <p style={{ fontSize: "16px", color: "#6b7280" }}>🎉 You have no overdue tasks.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {overdueTasks.map(task => (
            <li
              key={task.id}
              style={{
                marginBottom: "1rem",
                padding: "1rem",
                backgroundColor: categoryColors[task.category] + '20',
                borderLeft: `5px solid ${categoryColors[task.category] || "#9ca3af"}`,
                borderRadius: "8px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.1)"
              }}
            >
              <strong style={{ fontSize: "18px" }}>{task.title}</strong> <br />
              <span style={{ fontSize: "14px", color: "#374151" }}>{task.description}</span> <br />
              <span style={{ fontSize: "14px" }}>
                <strong>Due:</strong> {task.due_date} {task.due_time && `at ${task.due_time}`} <br />
                <strong>Category:</strong> {task.category.charAt(0).toUpperCase() + task.category.slice(1)} <br />
                <strong>Priority:</strong>{" "}
                <span style={{
                  color:
                    task.priority === 'high' ? '#dc2626' :
                    task.priority === 'medium' ? '#f59e0b' :
                    '#10b981'
                }}>
                  {task.priority.toUpperCase()}
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
