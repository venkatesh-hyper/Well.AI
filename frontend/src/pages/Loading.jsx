import React from "react";
import { Loader2, Sparkles } from "lucide-react";

const Loading = () => {
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-[#fde68a] via-[#fbcfe8] to-[#fca5a5] overflow-hidden">

      {/* Background Blobs */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>

      {/* Central Card */}
      <div className="z-10 px-10 py-12 bg-white/20 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl flex flex-col items-center space-y-8 max-w-md text-center">

        {/* Lucide Icon */}
        <div className="animate-[spin_2s_linear_infinite] text-white/90">
          <Loader2 size={48} strokeWidth={2} className="drop-shadow" />
        </div>

        {/* Fancy Text */}
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-black via-red-50 to-pink-50 bg-clip-text text-transparent tracking-wide animate-pulse">
          Preparing Well-AI
        </h1>

        {/* Tagline with Sparkles */}
        <div className="flex items-center space-x-2 text-green/80 text-lg font-medium">
          <Sparkles size={20} />
          <span>Wellness. Intelligence. Harmony.</span>
          <Sparkles size={20} />
        </div>

        {/* Subtle status dots */}
        <div className="flex space-x-2 mt-4">
          <span className="w-3 h-3 bg-white/50 rounded-full animate-bounce delay-100"></span>
          <span className="w-3 h-3 bg-white/50 rounded-full animate-bounce delay-200"></span>
          <span className="w-3 h-3 bg-white/50 rounded-full animate-bounce delay-300"></span>
        </div>
      </div>
    </div>
  );
};

export default Loading;
