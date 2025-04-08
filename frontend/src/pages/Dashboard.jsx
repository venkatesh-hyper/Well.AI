import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/5 bg-gray-800 text-white p-5 space-y-4">
        <h1 className="text-xl font-bold mb-4">Well-AI</h1>
        <Link to="general" className="block hover:text-green-300">🧬 General Health</Link>
        <Link to="mental" className="block hover:text-green-300">🧠 Mental Health</Link>
        <Link to="symptoms" className="block hover:text-green-300">🧪 Symptoms-Based</Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
