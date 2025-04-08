import React, { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { useNavigate } from 'react-router-dom';
import logo from "../assets/logo.png";
import healthBotAnimation from "../assets/healthbot.json"; // make sure this path exists

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard'); // ✅ correct route
    } catch (err) {
      alert(err.message);
    }
  };

  return (

    
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-300 to-pink-400 overflow-hidden">

{/* Brand Name Top-Left */}
<div className="absolute top-4 left-6 z-80 flex items-center space-x-2">
  <img src={logo} alt="Well-AI" className="w-20 h-20" />
  <h2 className="text-4xl font-bold text-gray-800 mb-4 drop-shadow-md">Well-AI</h2>
  <h4 className="text-xl font-bold text-gray-800 mb-4 drop-shadow-md">Wellness, Powered by Intelligence</h4>
</div>

      {/* Blurred gradient blobs */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse z-0" />
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse z-0" />


      {/* Optional Lottie Animation */}
      <Lottie
        animationData={healthBotAnimation}
        loop
        className="absolute w-[600px] h-[600px] bottom-10 right-10 opacity-70 z-0"
      />

      {/* Motion Animated Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 p-10 bg-white/30 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 flex flex-col items-center"
      >
    

        {/* Logo */}
        <img
          src={logo}
          alt="Well-AI Logo"
          className="w-24 h-24 mb-6 drop-shadow-xl transition-transform hover:scale-110"
        /> 
        
        {/* Title */}
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4 tracking-wide drop-shadow-md">
         LOGIN
        </h1>

        

        {/* Form */}
        <form onSubmit={handleLogin} className="w-80 space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            Login
          </button>
        </form>
      </motion.div>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 w-full text-center p-4 bg-white/30 backdrop-blur-md shadow-inner z-10">
        <p className="text-gray-700 text-sm">© 2025 Well-AI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Login;
