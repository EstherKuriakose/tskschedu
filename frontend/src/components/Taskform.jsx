import React, { useState } from "react";

const TaskForm = ({ onAdd }) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Personal");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;

    const newTask = {
      id: Date.now(),
      title,
      category,
      completed: false,
      dueDate: new Date().toISOString(),
    };

    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    localStorage.setItem("tasks", JSON.stringify([...tasks, newTask]));

    setTitle("");
    onAdd?.();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <select onChange={(e) => setCategory(e.target.value)} value={category}>
        <option>Work</option>
        <option>Personal</option>
      </select>
      <button type="submit">Add Task</button>
    </form>
  );
};

export default TaskForm;
