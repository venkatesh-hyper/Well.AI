import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import healthBotAnimation from "../assets/healthbot.json";
import { LogIn, UserPlus, HeartPulse, ShieldCheck, Activity } from "lucide-react";

const Welcome = () => {
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-300 to-pink-400 overflow-hidden">

      {/* Brand Top-Left */}
      <div className="absolute top-4 left-6 z-40 flex items-center space-x-4">
        <img src={logo} alt="Well-AI" className="w-20 h-20" />
        <div>
          <h2 className="text-4xl font-bold text-gray-800 drop-shadow-md">Well-AI</h2>
          <h4 className="text-xl font-semibold text-gray-700">Wellness, Powered by Intelligence</h4>
        </div>
      </div>

      {/* Background Blobs */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse z-0" />
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse z-0" />

      {/* Lottie Animation */}
      <Lottie
        animationData={healthBotAnimation}
        loop
        className="absolute w-[600px] h-[600px] bottom-10 right-10 opacity-70 z-0"
      />

      {/* Tilt + Motion Card */}
      <Tilt glareEnable glareMaxOpacity={0.45} glareColor="#ffffff" glarePosition="all" tiltMaxAngleX={10} tiltMaxAngleY={10}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 p-10 bg-white/30 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 flex flex-col items-center space-y-6"
        >
          {/* Title with Icon */}
          <div className="flex items-center space-x-3">
            <HeartPulse className="text-pink-600 w-10 h-10 animate-pulse" />
            <h1 className="text-4xl font-extrabold text-gray-800 tracking-wide drop-shadow">
              Welcome to Well-AI
            </h1>
          </div>

          {/* Features List */}
          <div className="text-gray-700 space-y-3 text-lg text-center font-medium">
            <div className="flex items-center justify-center space-x-2">
              <Activity className="text-green-600" /> <span>Smart Health Analytics</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <ShieldCheck className="text-blue-600" /> <span>Secure & Private</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <HeartPulse className="text-red-500" /> <span>AI-Powered Recommendations</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-4 mt-6">
            <Link to="/login">
              <button className="px-6 py-3 bg-pink-600 text-white rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 flex items-center space-x-2">
                <LogIn className="w-5 h-5" />
                <span>Login</span>
              </button>
            </Link>
            <Link to="/signup">
              <button className="px-6 py-3 bg-yellow-400 text-gray-900 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center space-x-2">
                <UserPlus className="w-5 h-5" />
                <span>Sign Up</span>
              </button>
            </Link>
          </div>
        </motion.div>
      </Tilt>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 w-full text-center p-4 bg-white/30 backdrop-blur-md shadow-inner z-10">
        <p className="text-gray-700 text-sm">© 2025 Well-AI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Welcome;
