import React from "react";
import logo from "../assets/logo.png"; // Make sure it's in src/assets

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-300 to-pink-400">
      <div className="flex flex-col items-center space-y-6">
        <div className="w-100 h-100 animate-spin-slow">
          <img
            src={logo}
            alt="Well-AI Logo"
            className="w-full h-full object-contain drop-shadow-xl"
          />
        </div>
        <p className="text-4xl font-semibold text-white animate-pulse">Loading Well-AI...</p>
      </div>
    </div>
  );
};

export default Loading;
