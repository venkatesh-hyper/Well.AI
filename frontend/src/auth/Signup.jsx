import React, { useState } from 'react';
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { useNavigate } from 'react-router-dom';
import logo from "../assets/logo.png";
import healthBotAnimation from "../assets/healthbot.json";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from '../firebase';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/dashboard");
    } catch (err) {
      alert("Google signup failed: " + err.message);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-300 to-pink-400 overflow-hidden">

      {/* Brand Top-Left */}
      <div className="absolute top-4 left-6 z-50 flex items-center space-x-3">
        <img src={logo} alt="Well-AI" className="w-16 h-16" />
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Well-AI</h2>
          <p className="text-sm text-gray-700">Wellness, Powered by Intelligence</p>
        </div>
      </div>

      {/* Background blobs */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse z-0" />
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse z-0" />

      {/* Lottie Animation */}
      <Lottie
        animationData={healthBotAnimation}
        loop
        className="absolute w-[600px] h-[600px] bottom-10 right-10 opacity-70 z-0"
      />

      {/* Signup Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 p-8 bg-white/30 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 flex flex-col items-center w-96"
      >
        <img
          src={logo}
          alt="Well-AI Logo"
          className="w-20 h-20 mb-4 drop-shadow-xl transition-transform hover:scale-110"
        />

        <h1 className="text-3xl font-bold text-gray-800 mb-6">Sign Up</h1>

        <form onSubmit={handleSignup} className="w-full space-y-4">
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
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
            Sign Up
          </button>
        </form>

        <div className="w-full mt-4 flex items-center justify-center">
          <span className="text-gray-600">or</span>
        </div>

        <button
          onClick={handleGoogleSignup}
          type="button"
          className="w-full bg-white text-black border border-gray-300 py-2 mt-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-100 transition"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google logo"
            className="w-5 h-5"
          />
          <span>Continue with Google</span>
        </button>

        {/* ➕ Link to Login */}
        <p className="mt-6 text-sm text-gray-800">
          Already have an account?{' '}
          <span
            onClick={() => navigate('/login')}
            className="text-blue-600 font-semibold cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </motion.div>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 w-full text-center p-4 bg-white/30 backdrop-blur-md shadow-inner z-10">
        <p className="text-gray-700 text-sm">© 2025 Well-AI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Signup;
