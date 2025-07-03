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
import CalendarPage from './pages/CalendarPage';
import WorkCategoryPage from './pages/WorkCategoryPage';
import PersonalCategoryPage from './pages/PersonalCategoryPage';
import ShoppingCategoryPage from './pages/ShoppingCategoryPage';
import HealthCategoryPage from './pages/HealthCategoryPage';
import OverduePage from './pages/OverduePage';
import OtherCategoryPage from './pages/OtherCategoryPage';
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
        <Route path="/category/work" element={<WorkCategoryPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/category/shopping" element={<ShoppingCategoryPage />} />
        <Route path="/category/health" element={<HealthCategoryPage />} />
        <Route path="/category/other" element={<OtherCategoryPage />} />
        <Route path="/overdue" element={<OverduePage />} />
        <Route path="/category/personal" element={<PersonalCategoryPage />} />
      </Routes>
    </Router>
  );
}

export default App;


