// src/App.jsx

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Signup";
import HighPriorityPage from "./pages/HighPriorityPage";
import LowPriorityPage from './pages/LowPriorityPage';
import MediumPriorityPage from './pages/MediumPriorityPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/high-priority" element={<HighPriorityPage/>} />
        <Route path="/low-priority" element={<LowPriorityPage/>} />
        <Route path="/medium-priority" element={<MediumPriorityPage />} />

      </Routes>
    </Router>
  );
}

export default App;


