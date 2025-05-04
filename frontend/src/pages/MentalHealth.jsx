import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import Lottie from 'lottie-react';
import { FaHeartbeat, FaBrain, FaStethoscope, FaCog } from "react-icons/fa";
import healthBotAnimation from '../assets/healthbot.json';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { auth, db } from '../firebase';

const MentalHealth = () => {
  const navigate = useNavigate();

  const [checkIn, setCheckIn] = useState({ mood: '', symptoms: [], journal: '' });
  const [checkIns, setCheckIns] = useState([]);
  const [sentimentText, setSentimentText] = useState('');
  const [sentimentResult, setSentimentResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    Gender: 'Male',
    Age: 25,
    Sleep_Duration: '7-8 hours',
    Work_Study_Hours: 40,
    Financial_Stress: 0,
    Academic_Work_Pressure: 2,
    Job_Study_Satisfaction: 7,
    Family_History_of_Mental_Illness: 'No',
    Suicidal_Thoughts: 'No'
  });

    // Added prompts for journaling
    const journalingPrompts = [
        "What were the highlights of your day?",
        "What challenges did you face today?",
        "How are you feeling emotionally?",
        "What are you grateful for today?",
        "What steps can you take to improve your well-being?",
        "Reflect on a positive interaction you had today.",
        "What is something you're looking forward to?",
        "Describe a moment when you felt at peace today.",
        "What are your goals for tomorrow?",
        "How can you show yourself more compassion?"
    ];
    const [currentPrompt, setCurrentPrompt] = useState(journalingPrompts[0]);

  useEffect(() => {
    const loadCheckIns = async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const q = query(collection(db, 'users', user.uid, 'checkins'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const entries = snapshot.docs.map(doc => ({
          ...doc.data(),
          createdAt: doc.data().createdAt // Keep the original createdAt for display
        }));
        console.log("Fetched check-in entries:", entries); // ADDED CONSOLE.LOG
        setCheckIns(entries);
      } catch (error) {
        console.error("Error loading check-ins:", error);
        toast.error("Failed to load check-ins.");
      }
    };
    loadCheckIns();
  }, []);

  const handlePredictChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckInChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setCheckIn(prev => ({
        ...prev,
        symptoms: checked
          ? [...prev.symptoms, value]
          : prev.symptoms.filter(s => s !== value),
      }));
    } else {
      setCheckIn(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckInSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) {
      toast.error("You need to be logged in.");
      return;
    }

    try {
      const now = new Date();
      await addDoc(collection(db, 'users', user.uid, 'checkins'), {
        ...checkIn,
        createdAt: now.toISOString(), // Store as ISO string
        timestamp: now, // Store as Timestamp object.  This is redundant, but shows both ways.
      });
      toast.success("Check-in saved!");
      setCheckIn({ mood: '', symptoms: [], journal: '' });
      // Refresh check-ins
      const q = query(collection(db, 'users', user.uid, 'checkins'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const entries = snapshot.docs.map(doc => ({
        ...doc.data(),
        createdAt: doc.data().createdAt, // Keep the original createdAt for display
      }));
      setCheckIns(entries);

    } catch (error) {
      console.error("Error saving check-in:", error);
      toast.error("Failed to save check-in.");
    }
  };

    const analyzeSentiment = async (text) => {
        setLoading(true);
        try {
            // Using a simple keyword-based approach for demonstration.  In a real app, use a proper sentiment analysis API.
            const positiveWords = ['happy', 'great', 'awesome', 'excited', 'good', 'amazing', 'fantastic', 'grateful', 'peaceful', 'love', 'joyful', 'content', 'optimistic'];
            const negativeWords = ['sad', 'depressed', 'anxious', 'stressed', 'worried', 'miserable', 'unhappy', 'gloomy', 'down', 'upset', 'angry', 'frustrated', 'lonely'];

            const textLower = text.toLowerCase();
            const positiveCount = positiveWords.filter(word => textLower.includes(word)).length;
            const negativeCount = negativeWords.filter(word => textLower.includes(word)).length;

            if (positiveCount > negativeCount) {
                setSentimentResult("You seem to be feeling positive! 😊");
            } else if (negativeCount > positiveCount) {
                setSentimentResult("It seems like you're going through a tough time. 🤗 Remember, it's okay to not be okay.");
            } else {
                setSentimentResult("Your feelings seem neutral. How can I help?");
            }

        } catch (error) {
            console.error("Sentiment analysis error:", error);
            toast.error("Failed to analyze sentiment. Please try again.");
            setSentimentResult(null); // Clear previous result on error
        } finally {
            setLoading(false);
        }
    };

  const handleSentimentAnalyze = () => {
    if (!sentimentText.trim()) {
      return toast.warn('Please write something first!');
    }
    analyzeSentiment(sentimentText);
  };

    const getSentimentIcon = () => {
        if (!sentimentResult) return null;
        if (sentimentResult.includes("positive")) return "😊";
        if (sentimentResult.includes("tough")) return "🤗";
        return "😐";
    };

    // Function to get a formatted date
    const getFormattedDate = (dateString) => {
        try {
            const date = new Date(dateString);
            console.log("Date string to format:", dateString); // ADDED CONSOLE.LOG
            const formattedDate =  date.toLocaleDateString('en-US', {
                weekday: 'short', // "Wed"
                month: 'short',   // "Oct"
                day: 'numeric',   // "26"
                year: 'numeric',  // "2023"
                hour: 'numeric',    // "1:30 PM"
                minute: '2-digit'
            });
            console.log("Formatted Date", formattedDate)
            return formattedDate;
        } catch (error) {
            console.error("Error formatting date:", error);
            return "Invalid Date";
        }
    };

    const getSymptomsDisplay= (symptoms) => {
        if (!symptoms || symptoms.length === 0) {
            return "None";
        }
        return symptoms.join(', ');
    };

    const handleNextPrompt = () => {
        setCurrentPrompt(journalingPrompts[(journalingPrompts.indexOf(currentPrompt) + 1) % journalingPrompts.length]);
    };
  console.log("CheckIns state:", checkIns); // ADDED CONSOLE.LOG
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-pink-100 p-4">
      <div className="flex items-center mb-6">
        <img src={logo} alt="Well-AI" className="w-12 h-12 mr-3" />
        <h1 className="text-2xl font-bold text-green-800">Well-AI: Mental Health</h1>
      </div>


      <div className="text-center px-4 py-6">
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 mb-4">
          How’s your mind today? 🧠
        </h2>
        <p className="text-gray-700 mb-6 max-w-md mx-auto">
          Let’s take a moment to reflect and support your mental wellness.
        </p>
        <div className="w-60 h-60 mx-auto mb-6">
          <Lottie animationData={healthBotAnimation} loop autoplay />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

        {/* Daily Check-In */}
        <form onSubmit={handleCheckInSubmit} className="bg-white rounded-2xl shadow-lg p-6 space-y-5">
          <h3 className="text-xl font-bold text-purple-700 mb-4">Weekly Check-In</h3>

          <div>
            <label className="block font-semibold text-purple-700">Mood</label>
            <select
              name="mood"
              value={checkIn.mood}
              onChange={handleCheckInChange}
              className="w-full px-4 py-2 border border-purple-300 rounded-md"
              required
            >
              <option value="">Select your mood</option>
              <option>😊 Happy</option>
              <option>😐 Okay</option>
              <option>😔 Sad</option>
              <option>😠 Stressed</option>
              <option>😩 Overwhelmed</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-purple-700">Symptoms</label>
            <div className="grid grid-cols-2 gap-2">
              {["Trouble sleeping", "Feeling anxious", "Low energy", "Mood swings", "Lack of motivation", "Irritability"].map((symptom) => (
                <label key={symptom} className="flex items-center">
                  <input
                    type="checkbox"
                    value={symptom}
                    checked={checkIn.symptoms.includes(symptom)}
                    onChange={handleCheckInChange}
                    className="accent-purple-500 mr-2"
                  />
                  {symptom}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-purple-700">Journal</label>
             <p className="text-sm text-gray-500 mb-1">Prompt: {currentPrompt}</p>
            <textarea
              name="journal"
              value={checkIn.journal}
              onChange={handleCheckInChange}
              className="w-full p-3 border border-purple-200 rounded-lg"
              rows="4"
              placeholder="Write anything on your mind..."
            ></textarea>
             <button
                type="button"
                onClick={handleNextPrompt}
                className="mt-2 text-purple-500 hover:text-purple-700 hover:underline"
            >
                Next Prompt
            </button>
          </div>

          <button type="submit" className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            Save My Check-In 📝
          </button>
        </form>

        {/* Sentiment Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-5">
          <h3 className="text-2xl font-semibold text-purple-700 mb-4">Feelings Analysis</h3>
          <textarea
            className="w-full p-3 border border-purple-200 rounded-lg"
            rows="4"
            placeholder="Share how your day went..."
            value={sentimentText}
            onChange={(e) => setSentimentText(e.target.value)}
          ></textarea>
          <button
            onClick={handleSentimentAnalyze}
            className="w-full py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
            disabled={loading}
          >
            {loading ? 'Analyzing...' : 'Analyze Sentiment 🧠'}
          </button>
          {sentimentResult && (
            <div className="text-center text-lg font-semibold text-purple-700">
              Sentiment: {sentimentResult} {getSentimentIcon()}
            </div>
          )}
        </div>
      </div>

      <div className="mt-10 text-center">
      <div className="mt-10 text-center">
  <button
    onClick={() => window.open("https://depressanalysis.streamlit.app/", "_blank")}
    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition"
  >
    Wanna test if you're in depression? 🤔
  </button>
</div>
</div>


{/* Timeline of Past Check-ins */}
<div className="mt-10 bg-white rounded-xl shadow-md p-6 max-h-80 overflow-y-auto">
  <h3 className="text-xl font-bold text-purple-700 mb-4">Check-In Timeline</h3>
  {checkIns.length === 0 ? (
    <p className="text-gray-500">No check-ins yet. Start with one above 👆</p>
  ) : (
    <ol className="relative border-l border-purple-300 space-y-6">
      {checkIns.map((entry, index) => {
        console.log("Entry Data:", entry); // ADDED CONSOLE.LOG
        return (
        <li key={index} className="ml-4">
          <div className="absolute w-3 h-3 bg-purple-500 rounded-full -left-1.5 top-1.5"></div>
          <div className="bg-purple-50 p-4 rounded-lg shadow-sm">
            <p className="text-sm text-purple-700"><strong>Mood:</strong> {entry.mood}</p>
            <p className="text-sm text-purple-700"><strong>Symptoms:</strong> {getSymptomsDisplay(entry.symptoms)}</p>
            <p className="text-sm text-purple-700"><strong>Journal:</strong> {entry.journal || '—'}</p>
            <p className="text-xs text-gray-500 mt-2">{getFormattedDate(entry.createdAt)}</p>
          </div>
        </li>
      )
      }
      )}
    </ol>
  )}
</div>

      <ToastContainer position="top-center" />
      {/* Bottom Navigation */}
            <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around py-4 z-50 shadow-md">
              <button onClick={() => navigate("/dashboard")} className="text-green-700"><FaHeartbeat size={24} /></button>
              <button onClick={() => navigate("/MentalHealth")} className="text-pink-700"><FaBrain size={24} /></button>
              <button onClick={() => navigate("/SymptomBased")} className="text-yellow-700"><FaStethoscope size={24} /></button>
              <button onClick={() => navigate('/Settings')} className="text-gray-700"><FaCog size={24} /></button>
            </nav>
    </div>
  );
};

export default MentalHealth;

