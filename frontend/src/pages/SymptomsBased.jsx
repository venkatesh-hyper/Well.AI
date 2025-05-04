import React, { useState } from "react";
import axios from "axios";
import logo from "../assets/logo.png";
import { FaHeartbeat, FaBrain, FaStethoscope, FaCog } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from "react-hot-toast";

const allSymptoms = [
  "itching", "skin_rash", "nodal_skin_eruptions", "continuous_sneezing", "chills", "joint_pain",
  "stomach_pain", "vomiting", "fatigue", "weight_loss", "anxiety", "high_fever", "headache",
  "nausea", "loss_of_appetite", "pain_behind_the_eyes", "back_pain", "constipation",
  "abdominal_pain", "diarrhoea", "yellow_urine", "yellowing_of_eyes", "acute_liver_failure",
  "swelling_of_stomach", "malaise", "blurred_and_distorted_vision", "phlegm", "throat_irritation",
  "sinus_pressure", "runny_nose", "chest_pain", "weakness_in_limbs", "pain_during_bowel_movements",
  "neck_pain", "dizziness", "cramps", "obesity", "puffy_face_and_eyes", "enlarged_thyroid",
  "brittle_nails", "excessive_hunger", "drying_and_tingling_lips", "slurred_speech", "muscle_weakness",
  "stiff_neck", "loss_of_balance", "unsteadiness", "weakness_of_one_body_side", "loss_of_smell",
  "bladder_discomfort", "continuous_feel_of_urine", "internal_itching", "toxic_look_(typhos)",
  "depression", "irritability", "altered_sensorium", "red_spots_over_body", "belly_pain",
  "increased_appetite", "lack_of_concentration", "visual_disturbances"
];

const SymptomsBased = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [predictionResults, setPredictionResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const API_BASE = "http://localhost:8000";

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setSelectedSymptoms((prev) =>
      checked ? [...prev, value] : prev.filter((sym) => sym !== value)
    );
  };

  const clearSelections = () => {
    setSelectedSymptoms([]);
  };

  const predictDisease = async () => {
    if (selectedSymptoms.length === 0) {
      toast.error("Please select at least one symptom.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/predict`, {
        symptoms: selectedSymptoms,
      });
      setPredictionResults(response.data);
      toast.success("Prediction successful!");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.detail || "Prediction failed.");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-rose-100 py-10 px-4">
      <Toaster />
      
      {/* Header */}
      <header className="flex items-center space-x-4 mb-8">
        <img src={logo} alt="Well-AI" className="w-12 h-12" />
        <h1 className="text-3xl font-bold text-emerald-700">Well-AI</h1>
      </header>

      {/* Title */}
      <section className="text-center mb-8">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 mb-2">
          Symptom-Based Diagnosis 🧠
        </h2>
        <p className="text-gray-600">Select your symptoms and let AI predict the possible disease.</p>
      </section>

      {/* Clear Button */}
      <div className="text-center mb-4">
        <button
          onClick={clearSelections}
          className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition"
        >
          Clear All
        </button>
      </div>

      {/* Symptom Selection */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-w-6xl mx-auto">
        {allSymptoms.map((symptom) => (
          <label key={symptom} className="flex items-center space-x-2 p-2 bg-white rounded shadow-sm hover:shadow-md cursor-pointer transition">
            <input
              type="checkbox"
              value={symptom}
              onChange={handleCheckboxChange}
              checked={selectedSymptoms.includes(symptom)}
              className="form-checkbox accent-green-600"
            />
            <span className="text-gray-700 text-sm">{symptom}</span>
          </label>
        ))}
      </div>

      {/* Predict Button */}
      <div className="text-center mt-10">
        <button
          onClick={predictDisease}
          disabled={isLoading}
          className={`px-8 py-3 text-white font-semibold rounded-lg shadow-lg transition ${
            isLoading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isLoading ? "Predicting..." : "🔍 Predict Disease"}
        </button>
      </div>

      {/* Results */}
      {predictionResults && (
        <div className="mt-10 max-w-2xl mx-auto bg-white shadow-xl rounded-lg p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-green-700 mb-4">Prediction Result 🧾</h3>
          <p className="text-gray-700 mb-2">
            <strong> our model predicts that you may have :</strong> {predictionResults.svm8020}
          </p>
          <p className="text-xs text-gray-500">
            ⚠️ This is not a diagnosis. Always consult a real doctor.
          </p>
        </div>
      )}

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 w-full bg-white/80 backdrop-blur-md shadow-inner border-t border-gray-200 py-3 flex justify-around z-50">
        <button onClick={() => navigate("/dashboard")} className="text-green-700"><FaHeartbeat size={24} /></button>
        <button onClick={() => navigate("/MentalHealth")} className="text-pink-600"><FaBrain size={24} /></button>
        <button onClick={() => navigate("/SymptomBased")} className="text-yellow-600"><FaStethoscope size={24} /></button>
        <button onClick={() => navigate('/Settings')} className="text-gray-600"><FaCog size={24} /></button>
      </nav>
    </div>
  );
};

export default SymptomsBased;
