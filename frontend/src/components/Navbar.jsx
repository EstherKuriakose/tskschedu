import React, { useState } from 'react';
import { FaHome, FaRegCalendarAlt, FaChevronDown, FaExclamationCircle } from 'react-icons/fa'; // 🔺 Added overdue icon
import './Navbar.css';
import { Link } from "react-router-dom";

export default function Navbar() {
  const [showPriority, setShowPriority] = useState(false);
  const [showCategory, setShowCategory] = useState(false);

  const priorityColors = {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#10b981'
  };

  const categoryColors = {
    personal: '#3b82f6',
    work: '#f97316',
    shopping: '#16a34a',
    health: '#dc2626',
    other: '#6366f1'
  };

  const togglePriority = () => {
    setShowPriority(prev => !prev);
    setShowCategory(false);
  };

  const toggleCategory = () => {
    setShowCategory(prev => !prev);
    setShowPriority(false);
  };

  return (
    <div className="navbar">
      <div className="navbar-item">
        <FaHome className="navbar-icon" />
        <Link to="/dashboard" className="navbar-link">Home</Link>
      </div>

      <div className="navbar-item dropdown">
        <span className="navbar-link" onClick={togglePriority}>
          Priority <FaChevronDown style={{ fontSize: '0.75rem', marginLeft: 4 }} />
        </span>
        {showPriority && (
          <div className="dropdown-menu">
            {Object.entries(priorityColors).map(([priority, color]) => (
              <Link key={priority} to={`/${priority}-priority`} className="dropdown-item">
                <span style={{
                  backgroundColor: color,
                  width: 12,
                  height: 12,
                  display: 'inline-block',
                  borderRadius: '50%',
                  marginRight: 8
                }}></span>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="navbar-item dropdown">
        <span className="navbar-link" onClick={toggleCategory}>
          Category <FaChevronDown style={{ fontSize: '0.75rem', marginLeft: 4 }} />
        </span>
        {showCategory && (
          <div className="dropdown-menu">
            {Object.entries(categoryColors).map(([category, color]) => (
              <Link key={category} to={`/category/${category}`} className="dropdown-item">
                <span style={{
                  backgroundColor: color,
                  width: 12,
                  height: 12,
                  display: 'inline-block',
                  borderRadius: '50%',
                  marginRight: 8
                }}></span>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Link>
            ))}
          </div>
        )}
      </div>
    {/* Overdue Icon */}
      <div className="navbar-item">
        <FaExclamationCircle className="navbar-icon" style={{ color: '#dc2626' }} />
        <Link to="/overdue" className="navbar-link">Overdue</Link>
      </div>
      <div className="navbar-item">
        <FaRegCalendarAlt className="navbar-icon" />
        <Link to="/calendar" className="navbar-link">Calendar</Link>
      </div>

      
    </div>
  );
}
