import { useState, useEffect } from 'react';

export default function TaskScheduler() {
 const user = JSON.parse(localStorage.getItem("user"));
  const [tasks, setTasks] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [filter, setFilter] = useState('all'); // all, pending, completed
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    dueTime: '',
    category: 'personal'
  });

  // Get current date and time
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const dateOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      const timeOptions = { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      };
      
      setCurrentDate(now.toLocaleDateString('en-US', dateOptions));
      setCurrentTime(now.toLocaleTimeString('en-US', timeOptions));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Generate unique ID for tasks
  const generateId = () => Date.now().toString();

  // Add new task
  const handleAddTask = () => {
    if (!newTask.title.trim()) return;

    const task = {
      id: generateId(),
      ...newTask,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null
    };

    setTasks(prev => [...prev, task]);
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      dueTime: '',
      category: 'personal'
    });
    setShowAddModal(false);
  };

  // Edit task
  const handleEditTask = (task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
      dueTime: task.dueTime,
      category: task.category
    });
    setShowAddModal(true);
  };

  // Update task
  const handleUpdateTask = () => {
    if (!newTask.title.trim()) return;

    setTasks(prev => prev.map(task => 
      task.id === editingTask.id 
        ? { ...task, ...newTask }
        : task
    ));

    setEditingTask(null);
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      dueTime: '',
      category: 'personal'
    });
    setShowAddModal(false);
  };

  // Delete task
  const handleDeleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(prev => prev.filter(task => task.id !== taskId));
    }
  };

  // Toggle task completion
const handleToggleComplete = async (taskId) => {
  const taskToUpdate = tasks.find(task => task.id === taskId);
  if (!taskToUpdate) return;

  const updatedTask = {
    ...taskToUpdate,
    completed: !taskToUpdate.completed,
    completedAt: !taskToUpdate.completed ? new Date().toISOString() : null
  };

  try {
    const response = await fetch(`http://localhost:8000/tasks/${taskId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        completed: updatedTask.completed,
        completedAt: updatedTask.completedAt
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to update task");
    }

    // Update task in local state
    setTasks(prev => prev.map(task =>
      task.id === taskId ? updatedTask : task
    ));
  } catch (err) {
    alert("Error updating task: " + err.message);
  }
};


  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  // Get task stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  // Priority colors
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  // Check if task is overdue
  const isOverdue = (task) => {
    if (!task.dueDate || task.completed) return false;
    const dueDateTime = new Date(`${task.dueDate} ${task.dueTime || '23:59'}`);
    return dueDateTime < new Date();
  };

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  };

  const headerStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px'
  };

  const statsStyle = {
    display: 'flex',
    gap: '24px',
    marginBottom: '24px',
    flexWrap: 'wrap'
  };

  const statCardStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    flex: '1',
    minWidth: '200px'
  };

  const controlsStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px'
  };

  const buttonStyle = {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  };

  const taskListStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  };

  const taskCardStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb'
  };

  const modalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px'
  };

  const modalContentStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    maxWidth: '500px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto'
  };

  return (
    
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div>
            <h2 style={{ marginBottom: "1rem", color: "#1f2937" }}>
  Welcome, {user?.name || "User"}!
</h2>

          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#1f2937' }}>
            Task Scheduler
          </h1>
          <p style={{ margin: '4px 0 0 0', color: '#6b7280' }}>
            {currentDate} • {currentTime}
          </p>
        </div>
        <button 
          style={buttonStyle}
          onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
          onClick={() => setShowAddModal(true)}
        >
          + Add Task
        </button>
      </div>

      {/* Stats */}
      <div style={statsStyle}>
        <div style={statCardStyle}>
          <h3 style={{ margin: '0 0 8px 0', color: '#1f2937', fontSize: '18px' }}>Total Tasks</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#3b82f6' }}>
            {totalTasks}
          </p>
        </div>
        <div style={statCardStyle}>
          <h3 style={{ margin: '0 0 8px 0', color: '#1f2937', fontSize: '18px' }}>Completed</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}>
            {completedTasks}
          </p>
        </div>
        <div style={statCardStyle}>
          <h3 style={{ margin: '0 0 8px 0', color: '#1f2937', fontSize: '18px' }}>Pending</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#f59e0b' }}>
            {pendingTasks}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div style={controlsStyle}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', 'pending', 'completed'].map(filterType => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              style={{
                ...buttonStyle,
                backgroundColor: filter === filterType ? '#3b82f6' : '#e5e7eb',
                color: filter === filterType ? 'white' : '#374151',
                padding: '8px 16px',
                fontSize: '12px'
              }}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </button>
          ))}
        </div>
        <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
          Showing {filteredTasks.length} of {totalTasks} tasks
        </p>
      </div>

      {/* Task List */}
      <div style={taskListStyle}>
        {filteredTasks.length === 0 ? (
          <div style={{
            ...taskCardStyle,
            textAlign: 'center',
            padding: '40px',
            color: '#6b7280'
          }}>
            <p style={{ margin: 0, fontSize: '18px' }}>
              {filter === 'all' ? 'No tasks yet. Create your first task!' :
               filter === 'completed' ? 'No completed tasks yet.' :
               'No pending tasks. Great job!'}
            </p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div 
              key={task.id} 
              style={{
                ...taskCardStyle,
                borderLeft: `4px solid ${getPriorityColor(task.priority)}`,
                backgroundColor: task.completed ? '#f9fafb' : 'white',
                opacity: task.completed ? 0.8 : 1
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ 
                    margin: '0 0 8px 0', 
                    fontSize: '18px', 
                    fontWeight: 'bold',
                    textDecoration: task.completed ? 'line-through' : 'none',
                    color: task.completed ? '#6b7280' : '#1f2937'
                  }}>
                    {task.title}
                  </h3>
                  {task.description && (
                    <p style={{ 
                      margin: '0 0 12px 0', 
                      color: '#6b7280',
                      textDecoration: task.completed ? 'line-through' : 'none'
                    }}>
                      {task.description}
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{
                      backgroundColor: getPriorityColor(task.priority),
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {task.priority.toUpperCase()}
                    </span>
                    <span style={{
                      backgroundColor: '#e5e7eb',
                      color: '#374151',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {task.category}
                    </span>
                    {task.dueDate && (
                      <span style={{
                        color: isOverdue(task) ? '#ef4444' : '#6b7280',
                        fontSize: '14px',
                        fontWeight: isOverdue(task) ? '600' : 'normal'
                      }}>
                        Due: {task.dueDate} {task.dueTime && `at ${task.dueTime}`}
                        {isOverdue(task) && ' (OVERDUE)'}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
                  <button
                    onClick={() => handleToggleComplete(task.id)}
                    style={{
                      backgroundColor: task.completed ? '#10b981' : '#e5e7eb',
                      color: task.completed ? 'white' : '#374151',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    {task.completed ? '✓ Done' : 'Mark Done'}
                  </button>
                  <button
                    onClick={() => handleEditTask(task)}
                    style={{
                      backgroundColor: '#f59e0b',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    style={{
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Task Modal */}
      {showAddModal && (
        <div style={modalStyle} onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowAddModal(false);
            setEditingTask(null);
            setNewTask({
              title: '',
              description: '',
              priority: 'medium',
              dueDate: '',
              dueTime: '',
              category: 'personal'
            });
          }
        }}>
          <div style={modalContentStyle}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '20px', fontWeight: 'bold' }}>
              {editingTask ? 'Edit Task' : 'Add New Task'}
            </h2>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                Task Title *
              </label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter task title"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '16px'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                Description
              </label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter task description (optional)"
                rows={3}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '16px',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                  Priority
                </label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '16px'
                  }}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                  Category
                </label>
                <select
                  value={newTask.category}
                  onChange={(e) => setNewTask(prev => ({ ...prev, category: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '16px'
                  }}
                >
                  <option value="personal">Personal</option>
                  <option value="work">Work</option>
                  <option value="shopping">Shopping</option>
                  <option value="health">Health</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                  Due Date
                </label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '16px'
                  }}
                />
              </div>
              
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                  Due Time
                </label>
                <input
                  type="time"
                  value={newTask.dueTime}
                  onChange={(e) => setNewTask(prev => ({ ...prev, dueTime: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '16px'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingTask(null);
                  setNewTask({
                    title: '',
                    description: '',
                    priority: 'medium',
                    dueDate: '',
                    dueTime: '',
                    category: 'personal'
                  });
                }}
                style={{
                  backgroundColor: '#e5e7eb',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={editingTask ? handleUpdateTask : handleAddTask}
                style={{
                  ...buttonStyle,
                  padding: '10px 20px'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
              >
                {editingTask ? 'Update Task' : 'Add Task'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}