import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/logo.png";
import Lottie from "lottie-react";
import healthBotAnimation from "../assets/healthbot.json";
import { FaHeartbeat, FaBrain, FaStethoscope, FaCog } from "react-icons/fa";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-br from-yellow-100 to-pink-100">
      {/* Top Brand */}
      <div className="flex items-center p-4">
        <img src={logo} alt="Well-AI" className="w-12 h-12 mr-3" />
        <h1 className="text-2xl font-bold text-green-800">Well-AI</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-10">
        <Lottie animationData={healthBotAnimation} loop className="w-96 h-96 opacity-80 mb-6" />
        <h2 className="text-xl font-semibold text-green-700">Welcome to the Health Dashboard</h2>
      </div>

      {/* Bottom Navigation */}
      <div className="sticky bottom-0 z-50 bg-white/80 backdrop-blur-md shadow-inner flex justify-around py-4 border-t border-gray-200">
        <button onClick={() => navigate("/dashboard")} className="btn-3d text-green-700"><FaHeartbeat size={24} /></button>
        <button onClick={() => navigate("/mental-health")} className="btn-3d text-pink-700"><FaBrain size={24} /></button>
        <button onClick={() => navigate("/symptom-based")} className="btn-3d text-yellow-700"><FaStethoscope size={24} /></button>
        <button onClick={() => alert('Settings coming soon!')} className="btn-3d text-gray-700"><FaCog size={24} /></button>
      </div>
    </div>
  );
};

export default Dashboard;
