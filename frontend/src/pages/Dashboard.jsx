import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, Brain, Stethoscope, Settings } from "lucide-react";
import { motion } from "framer-motion";
import UserHealthVisualization from "../components/UserHealthVisualization";

const Dashboard = () => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-yellow-100 to-pink-100">
      {/* Sidebar */}
      <div className="w-20 bg-white shadow-xl flex flex-col items-center py-6 space-y-6">
        <Link to="/dashboard/userhealthdata">
          <LayoutDashboard
            className={`w-8 h-8 ${location.pathname.includes("userhealthdata") ? "text-pink-500" : "text-gray-400"}`}
          />
        </Link>
        <Link to="/dashboard/mentalhealth">
          <Brain
            className={`w-8 h-8 ${location.pathname.includes("mentalhealth") ? "text-pink-500" : "text-gray-400"}`}
          />
        </Link>
        <Link to="/dashboard/symptombased">
          <Stethoscope
            className={`w-8 h-8 ${location.pathname.includes("symptombased") ? "text-pink-500" : "text-gray-400"}`}
          />
        </Link>
        <Link to="/dashboard/settings">
          <Settings
            className={`w-8 h-8 ${location.pathname.includes("settings") ? "text-pink-500" : "text-gray-400"}`}
          />
        </Link>
      </div>

      {/* Main Panel */}
      <div className="flex-1 p-8 overflow-y-auto">
        <motion.h1
          className="text-4xl font-bold text-gray-800 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Welcome to Your Dashboard
        </motion.h1>

        {/* Health Data Visualization Component */}
        <UserHealthVisualization />

        {/* Render nested child pages like UserHealthData, MentalHealth, etc. */}
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
