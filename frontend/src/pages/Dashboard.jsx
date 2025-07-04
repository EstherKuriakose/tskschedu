//ogg
import { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Navbar from '../components/Navbar';
import { predictPriority, isDuplicateTask } from '../utils/aiUtils';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import AIAssistantModal from '../components/AIAssistantModal';

export default function TaskScheduler() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [filter, setFilter] = useState('all');
  const [showAiModal, setShowAiModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    dueTime: '',
    category: 'personal'
  });

  // Load user and tasks
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

//   useEffect(() => {
//   if (user) {
//     fetch(`http://localhost:8000/tasks/${user.name}`)
//       .then(res => res.json())
//       .then(data => {
//         console.log("Fetched Tasks:", data);  // Add this line
//         setTasks(data);
//       })
//       .catch(err => console.error("Error fetching tasks:", err));
//   }
// }, [user]);


  useEffect(() => {
    if (user) {
      fetch(`http://localhost:8000/tasks/${user.name}`)
        .then(res => res.json())
        .then(data => {
  console.log("Tasks from backend:", data);
  data.forEach((task, idx) => {
    console.log(`Task ${idx}: id=${task.id}, title=${task.title}`);
  });
  setTasks(data);
})
        .catch(err => console.error("Error fetching tasks:", err));
    }
  }, [user]);

  // Current date and time
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentDate(now.toLocaleDateString('en-US', { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
      }));
      setCurrentTime(now.toLocaleTimeString('en-US', { 
        hour: '2-digit', minute: '2-digit', hour12: true 
      }));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Priority prediction
  useEffect(() => {
    if (newTask.title.trim()) {
      const suggested = predictPriority(newTask.title);
      setNewTask(prev => ({ ...prev, priority: suggested }));
    }
  }, [newTask.title]);

  // Task operations
  const handleAddTask = async () => {
    if (!newTask.title.trim()) return;
    if (isDuplicateTask(newTask.title, tasks)) {
      alert("This task seems to be a duplicate.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/tasks/${user.name}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask)
      });
      
      if (!response.ok) throw new Error("Failed to add task");
      
      const updatedTasks = await fetch(`http://localhost:8000/tasks/${user.name}`)
        .then(res => res.json());
      
      setTasks(updatedTasks);
      setShowAddModal(false);
      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        dueTime: '',
        category: 'personal'
      });
    } catch (err) {
      alert("Error adding task: " + err.message);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title ?? "",
      description: task.description ?? "",
      priority: task.priority ?? "medium",
      dueDate: task.due_date ?? "",
      dueTime: task.due_time ?? "",
      category: task.category ?? "personal"
    });
    setShowAddModal(true);
  };

  const handleUpdateTask = async () => {
    if (!newTask.title.trim()) return;
    
    try {
      const response = await fetch(`http://localhost:8000/tasks/${editingTask.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask)
      });

      if (!response.ok) throw new Error("Failed to update task");
      
      setTasks(prev => 
        prev.map(task => 
          task.id === editingTask.id ? { ...task, ...newTask } : task
        )
      );
      
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
    } catch (err) {
      alert("Error updating task: " + err.message);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await fetch(`http://localhost:8000/tasks/${taskId}`, { method: "DELETE" });
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (err) {
      alert("Error deleting task: " + err.message);
    }
  };

  const handleToggleComplete = async (taskId) => {
    const taskToUpdate = tasks.find(task => task.id === taskId);
    if (!taskToUpdate) return;
    
    const updatedTask = {
      ...taskToUpdate,
      completed: !taskToUpdate.completed,
      completed_at: !taskToUpdate.completed ? new Date().toISOString() : null
    };

    try {
      await fetch(`http://localhost:8000/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask)
      });
      
      setTasks(prev => prev.map(task => 
        task.id === taskId ? updatedTask : task
      ));
    } catch (err) {
      alert("Error updating task: " + err.message);
    }
  };

  // Drag and drop
 const handleDragEnd = (result) => {
  const { source, destination } = result;

  // Dropped outside the list
  if (!destination) return;

  // No movement
  if (source.index === destination.index && source.droppableId === destination.droppableId) {
    return;
  }

  const reorderedTasks = Array.from(sortedFilteredTasks);
  const [movedTask] = reorderedTasks.splice(source.index, 1);
  reorderedTasks.splice(destination.index, 0, movedTask);

  // Rebuild the full task list (preserve order of unfiltered items)
  const reorderedFull = tasks.map(task => {
    const newTask = reorderedTasks.find(t => t.id === task.id);
    return newTask ? newTask : task;
  });

  setTasks(reorderedFull);
};


  // Filter and sort tasks
  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  const sortedFilteredTasks = [...filteredTasks].sort((a, b) => a.completed - b.completed);

  // Stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  // Helper functions
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const isOverdue = (task) => {
    if (!task.dueDate || task.completed) return false;
    const dueDateTime = new Date(`${task.dueDate} ${task.dueTime || '23:59'}`);
    return dueDateTime < new Date();
  };

  // Styles
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
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
          <button 
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              fontWeight: '500',
              cursor: 'pointer',
              fontSize: '14px',
              transition: '0.3s'
            }}
            onClick={() => setShowAddModal(true)}
          >
            + Add Task
          </button>
          <button
            onClick={() => setShowAiModal(true)}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '30px',
              cursor: 'pointer'
            }}
            title="AI Assistant"
          >
            🤖
          </button>
        </div>
      </div>
      
      <Navbar/>
      
      {/* Stats */}
      <div style={statsStyle}>
        <div style={statCardStyle}>
          <h3 style={{ margin: '0 0 8px 0', color: '#1f2937', fontSize: '18px' }}>
            Completion Summary
          </h3>
          <div style={{ width: 100, height: 100, margin: 'auto' }}>
            <CircularProgressbar
              value={completedTasks}
              maxValue={totalTasks || 1}
              text={`${totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%`}
              styles={buildStyles({
                textColor: "#1f2937",
                pathColor: "#10b981",
                trailColor: "#e5e7eb",
                textSize: "18px",
              })}
            />
          </div>
        </div>
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

      {/* Task List with Drag and Drop */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="taskList" type="TASK">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={taskListStyle}
            >
              {sortedFilteredTasks.map((task, index) => (
                <Draggable 
                  key={task.id.toString()} 
                  draggableId={task.id.toString()} 
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...taskCardStyle,
                        borderLeft: `4px solid ${getPriorityColor(task.priority)}`,
                        backgroundColor: task.completed ? '#f9fafb' : 'white',
                        opacity: task.completed ? 0.8 : 1,
                        marginBottom: '12px',
                        transform: snapshot.isDragging ? 'scale(1.02)' : 'none',
                        boxShadow: snapshot.isDragging 
                          ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                          : '0 1px 3px rgba(0, 0, 0, 0.1)',
                        cursor: snapshot.isDragging ? 'grabbing' : 'grab',
                        ...provided.draggableProps.style
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
                  )}
                </Draggable>
              ))}
              {sortedFilteredTasks.length === 0 ? (
  <>
    {provided.placeholder}
    <div
      style={{
        ...taskCardStyle,
        textAlign: 'center',
        padding: '40px',
        color: '#6b7280'
      }}
    >
      <p style={{ margin: 0, fontSize: '18px' }}>
        {filter === 'all'
          ? 'No tasks yet. Create your first task!'
          : filter === 'completed'
          ? 'No completed tasks yet.'
          : 'No pending tasks. Great job!'}
      </p>
    </div>
  </>
) : (
  <>
    {provided.placeholder}
  </>
)}

            </div>
          )}
        </Droppable>
      </DragDropContext>

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
              >
                {editingTask ? 'Update Task' : 'Add Task'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* AI Assistant Modal */}
      {showAiModal && user && (
  <AIAssistantModal user={user} onClose={() => setShowAiModal(false)} />
)}

    </div>
  );
}