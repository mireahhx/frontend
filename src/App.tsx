import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Registration from './components/Registration';

const App: React.FC = () => {
    return (
        <Router>
            <div className="container">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Registration />} />
                    <Route path="*" element={<div>Page not found</div>} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
