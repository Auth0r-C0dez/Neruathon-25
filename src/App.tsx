import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ControlNetAI from './pages/ControlNetAI';
import MultiModelAI from './pages/MultiModelAI';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/controlnet" element={<ControlNetAI />} />
          <Route path="/multimodel" element={<MultiModelAI />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;