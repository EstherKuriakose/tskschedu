import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { TbLayoutNavbar } from 'react-icons/tb';
export default function HighPriorityPage() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:8000/tasks/${user.name}`)
        .then(res => res.json())
        .then(data => {
          const highTasks = data.filter(task => task.priority === 'high');
          setTasks(highTasks);
        })
        .catch(err => console.error("Error fetching high priority tasks:", err));
    }
  }, [user]);

  return (
    
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      
      <Navbar/>
     <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "1rem", color: "darkred" }}>
    High Priority Tasks
    </h1>

      {tasks.length === 0 ? (
        <p>No high priority tasks found.</p>
      ) : (
        <ul style={{ padding: 0, listStyle: "none" }}>
          {tasks.map(task => (
            <li key={task.id} style={{
              border: "1px solid #ccc",
              padding: "1rem",
              borderRadius: "8px",
              marginBottom: "1rem",
              backgroundColor: "#fff6f6"
            }}>
              <h3 style={{ margin: 0 }}>{task.title}</h3>
              <p>{task.description}</p>
              <p><strong>Due:</strong> {task.due_date} {task.due_time && `at ${task.due_time}`}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
