import React, { useEffect, useState } from 'react';

export default function AIAssistantModal({ user, onClose }) {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !user.name) {
      setError("User not found or not logged in");
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const fetchSummary = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/tasks/${encodeURIComponent(user.name)}`,
          { signal: controller.signal }
        );
        const data = await res.json();
        clearTimeout(timeoutId);

        if (!res.ok) {
          throw new Error(data.detail || "Something went wrong");
        }

        let lines = [
         `Hey ${user.name}, I'm Zeni your daily task whisperer!`,
`Hope you're having a productive day. Here's your personalized task rundown:\n`

        ];

        const highPriority = [];

        if (data.length === 0) {
          lines.push("You have no tasks.");
        } else {
          data.forEach(task => {
            if (!task.completed) {
              const due = task.due_date
                ? `${task.due_date}${task.due_time ? ` at ${task.due_time}` : ""}`
                : "No due date";
              lines.push(`• ${task.title} → Due: ${due}`);

              if (task.priority === "High") {
                highPriority.push(task.title);
              }
            }
          });
        }

        if (highPriority.length > 0) {
          lines.push(
            "\n🔥 High Priority Tasks:",
            ...highPriority.map(title => `- ${title}`)
          );
        }

        setSummary(lines.join("\n"));

      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error("Summary fetch error:", err);
        setError(err.message || "Error loading summary");
      }
    };

    fetchSummary();

    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [user]);

  return (
    <div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', zIndex: 999
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          backgroundColor: 'white', padding: '24px', borderRadius: '12px',
          maxWidth: '600px', width: '90%', maxHeight: '80vh', overflowY: 'auto'
        }}
      >
       <h2 style={{
  fontSize: '28px',
  fontWeight: 'bold',
  marginBottom: '16px',
  color: '#4f46e5',
  letterSpacing: '0.5px',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  textAlign: 'left',
  justifyContent: 'flex-start'
}}>
  🤖 <span style={{ fontFamily: 'Segoe UI', fontWeight: 700 }}>Zeni</span>
</h2>

        {error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : summary ? (
          <div
            style={{
              maxHeight: '60vh',
              overflowY: 'auto',
              whiteSpace: 'pre-wrap',
              paddingRight: '10px'
            }}
          >
            <pre style={{ margin: 0 }}>{summary}</pre>
          </div>
        ) : (
          <p>⏳ Generating summary...</p>
        )}
        <button
          onClick={onClose}
          style={{
            marginTop: '16px',
            padding: '10px 20px',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
