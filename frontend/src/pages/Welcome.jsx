import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import healthBotAnimation from "../assets/healthbot.json"; // Make sure you have this JSON

const Welcome = () => {
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-300 to-pink-400 overflow-hidden">

        {/* Brand Name Top-Left */}
        <div className="absolute top-4 left-6 z-40 flex items-center space-x-2">
          <img src={logo} alt="Well-AI" className="w-22 h-22" />
          <h2 className="text-4xl font-bold text-gray-800 mb-4 drop-shadow-md">Well-AI</h2><br/>
          <h4 className="text-xl font-bold text-gray-800 mb-4 drop-shadow-md">Wellness, Powered by Intelligence</h4>
        </div>

      {/* Background blobs */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse z-0"></div>
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse z-0"></div>
        
      <Lottie
        animationData={healthBotAnimation}
        loop
        className="absolute w-[600px] h-[600px] bottom-10 right-10 opacity-70 z-0"
      />

      {/* 3D Tilt Wrapper */}
      <Tilt
        glareEnable={true}
        glareMaxOpacity={0.45}
        glareColor="#ffffff"
        glarePosition="all"
        tiltMaxAngleX={10}
        tiltMaxAngleY={10}
      >
        {/* Motion Animated Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 p-10 bg-white/30 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 flex flex-col items-center"
        >
        

          {/* Logo
          <img
            src={logo}
            alt="Well-AI Logo"
            className="w-20 h-20 mb-5 drop-shadow-xl transform transition-transform hover:scale-110"
          />  */}

            {/* Title */}
          <h1 className="text-5xl font-extrabold text-gray-800 mb-6 tracking-wide drop-shadow">
            WELCOME to WELL-AI
          </h1>

          {/* Buttons */}
          <div className="flex space-x-4">
            <Link to="/login">
              <button className="px-8 py-5 bg-pink-600 text-white rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-200">
                Login
              </button>
            </Link>
            <Link to="/signup">
              <button className="px-8 py-5 bg-yellow-400 text-gray-900 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                Sign Up
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
