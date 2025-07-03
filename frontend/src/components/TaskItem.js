import React, { useEffect, useState } from "react";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  // Load tasks from localStorage when component mounts
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    setTasks(storedTasks);
  }, []);

  // Update localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const toggleComplete = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
  };

  return (
    <div>
      <h3>Your Tasks 📝</h3>
      {tasks.length === 0 ? (
        <p>No tasks added yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tasks.map((task) => (
            <li
              key={task.id}
              style={{
                margin: "10px 0",
                backgroundColor: "#f9f9f9",
                padding: "10px",
                borderRadius: "8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                textDecoration: task.completed ? "line-through" : "none"
              }}
            >
              <div>
                <strong>{task.title}</strong> <br />
                <small>Category: {task.category}</small>
              </div>
              <div>
                <button onClick={() => toggleComplete(task.id)}>
                  {task.completed ? "Undo" : "Done"}
                </button>{" "}
                <button
                  onClick={() => deleteTask(task.id)}
                  style={{ color: "red" }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;
