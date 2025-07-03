import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Navbar from '../components/Navbar';
import { Tooltip } from 'react-tooltip';


// Define colors per category
const categoryColors = {
  personal: '#4f46e5',
  work: '#10b981',
  shopping: '#f59e0b',
  health: '#ef4444',
  other: '#6b7280'
};

export default function CalendarPage() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:8000/tasks/${user.name}`)
        .then(res => res.json())
        .then(data => setTasks(data))
        .catch(err => console.error("Error fetching tasks:", err));
    }
  }, [user]);

  const tasksForDate = tasks.filter(task =>
    task.due_date === selectedDate.toISOString().split("T")[0]
  );

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <Navbar />
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "1rem" }}>
        Task Calendar
      </h1>

      {/* Legend */}
      <div style={{ marginBottom: "1rem" }}>
        <strong>Category Legend:</strong>
        <div style={{ display: 'flex', gap: '10px', marginTop: '0.5rem' }}>
          {Object.entries(categoryColors).map(([cat, color]) => (
            <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: 12, height: 12, backgroundColor: color, borderRadius: '50%' }}></div>
              <span>{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem' }}>
        {/* Calendar */}
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          tileContent={({ date }) => {
            const dateStr = date.toISOString().split("T")[0];
            const tileTasks = tasks.filter(task => task.due_date === dateStr);
            const taskTitles = tileTasks.map(t => t.title).join(", ");

            return tileTasks.length > 0 ? (
              <div data-tooltip-id="task-tooltip" data-tooltip-content={taskTitles}>
                <div style={{
                  display: 'flex',
                  gap: '2px',
                  marginTop: '2px',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexWrap: 'wrap'
                }}>
                  {tileTasks.map((task, index) => (
                    <div
                      key={index}
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        backgroundColor: categoryColors[task.category] || '#9ca3af'
                      }}
                    />
                  ))}
                </div>
                <Tooltip id="task-tooltip" place="top" />

              </div>
            ) : null;
          }}
        />

        {/* Task List for Selected Date */}
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: "20px", marginBottom: "1rem" }}>
            Tasks for {selectedDate.toDateString()}:
          </h2>
          {tasksForDate.length === 0 ? (
            <p>No tasks for this date.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {tasksForDate.map(task => (
                <li key={task.id} style={{
                  padding: "1rem",
                  backgroundColor: categoryColors[task.category] + '20',
                  borderLeft: `5px solid ${categoryColors[task.category]}`,
                  borderRadius: "8px",
                  marginBottom: "1rem"
                }}>
                  <strong>{task.title}</strong> - {task.category} ({task.priority})
                  <br />
                  <em>{task.description}</em>
                  <br />
                  Due Time: {task.due_time || "N/A"}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
