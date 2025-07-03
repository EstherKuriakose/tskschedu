import React from 'react';
import { FaTasks, FaRegCalendarAlt, FaArrowCircleUp, FaArrowCircleDown, FaCircle } from 'react-icons/fa';
import './Navbar.css'; // You can create custom styles
import { Link } from "react-router-dom";
export default function Navbar() {
  return (
    <div className="navbar">
      <div className="navbar-item">
        <FaTasks className="navbar-icon" />
        <span>Daily Tasks</span>
      </div>

      <div className="navbar-item">
        <FaArrowCircleUp className="navbar-icon high" />
         <Link to="/high-priority" style={{ textDecoration: "none" }}>High Priority</Link>
      </div>

      <div className="navbar-item">
        <FaCircle className="navbar-icon medium" />
        <Link to="/medium-priority" style={{ textDecoration: "none" }}>Medium Priority</Link>
      </div>

      <div className="navbar-item">
        <FaArrowCircleDown className="navbar-icon low" />
        <Link to="/low-priority" style={{ textDecoration: "none" }}>Low Priority</Link>
      </div>

      <div className="navbar-item">
        <FaRegCalendarAlt className="navbar-icon" />
        <span>Calendar</span>
      </div>
    </div>
  );
}
