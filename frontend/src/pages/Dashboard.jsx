import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/logo.png";
import Lottie from "lottie-react";
import healthBotAnimation from "../assets/healthbot.json";
import { FaHeartbeat, FaBrain, FaStethoscope, FaCog, FaUserEdit, FaChartLine, FaCalculator, FaTimesCircle } from "react-icons/fa";
import HealthChart from '../components/HealthChart';
import { getAuth } from 'firebase/auth';

const Dashboard = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    weight: 70,
    height: 1.75,
    waist: 80,
    neck: 38,
    gender: 'Male', // Default gender
    activity_level: 1.375,
    bone_density: 1.1,
    sleep_hours: 7,
    water_intake: 2.5,
    hip: 90,
    name: 'admin', // Default name
    age: 22, // Default age
  });

  const [results, setResults] = useState(null);
  const [userName, setUserName] = useState('admin');

  // Firebase authentication to get the logged-in user's name
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setUserName(user.displayName || 'admin');
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const val = type === "number" ? parseFloat(value) : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const calculateMetrics = () => {
    const {
      weight, height, age, waist, neck, gender,
      activity_level, bone_density, sleep_hours,
      water_intake, hip,
    } = formData;

    const bmi = weight / (height ** 2);
    const bfp = gender === 'Male'
      ? (1.20 * bmi) + (0.23 * age) - 16.2
      : (1.20 * bmi) + (0.23 * age) - 5.4;
    const bmr = (10 * weight) + (6.25 * height * 100) - (5 * age) + (gender === 'Male' ? 5 : -161);
    const tdee = bmr * activity_level;
    const whtr = waist / (height * 100);
    const risk_level = whtr >= 0.5 ? "High risk" : "Low risk";
    const ideal_weight = gender === 'Male'
      ? 50 + (2.3 * ((height * 100 / 2.54) - 60))
      : 45.5 + (2.3 * ((height * 100 / 2.54) - 60));
    const lbm = weight * (1 - (bfp / 100));
    const metabolic_age = (bmr / 1500) * age;
    const t_score = (bone_density - 1.2) / 0.1;
    const weight_loss_deficit = tdee - 500;
    const protein = weight * 2.2;
    const carbs = (tdee * 0.5) / 4;
    const fats = (tdee * 0.3) / 9;
    const hydration_status = water_intake >= 2.7 ? "Adequate" : "Low";
    const sleep_status = sleep_hours >= 7 ? "Good" : "Needs Improvement";

    setResults({
      bmi, bfp, lbm, bmr, tdee, whtr, risk_level, ideal_weight,
      metabolic_age, t_score, weight_loss_deficit, protein, carbs,
      fats, hydration_status, sleep_status
    });
  };

  const labels = ["Week 1", "Week 2", "Week 3", "Week 4"];
  const bmiData = [22.5, 22.8, 22.3, results?.bmi || 22.1];
  const bfpData = [18.2, 17.9, 17.6, results?.bfp || 17.3];
  const clearResults = () => setResults(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-100 to-lime-200 pb-20 flex flex-col relative overflow-hidden">

      {/* Header */}
      <header className="bg-gradient-to-r from-green-400 to-blue-500 py-4 px-6 shadow-md rounded-b-xl flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Well-AI Logo" className="w-12 h-12 rounded-full shadow" />
          <h1 className="text-2xl font-bold text-white tracking-tight">Well-AI</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white font-semibold text-lg hidden md:block">Hello, {userName}</span>
          <button
            onClick={() => navigate("/edit-credentials")}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-md text-sm font-semibold transition duration-200 ease-in-out flex items-center gap-1"
          >
            <FaUserEdit size={16} />
            <span className="hidden md:inline">Edit</span>
          </button>
        </div>
      </header>

      {/* Animation Section */}
      <section className="py-8">
        <div className="container mx-auto flex justify-center items-center">
          <Lottie animationData={healthBotAnimation} loop className="w-48 h-48 md:w-64 md:h-64" />
        </div>
      </section>

      {/* Health Progress Chart */}
      <section className="container mx-auto p-6 rounded-xl shadow-lg bg-white/90 backdrop-blur-sm mb-8">
        <div className="flex items-center mb-4">
          <FaChartLine className="text-green-500 mr-2 text-xl" />
          <h3 className="text-xl font-semibold text-gray-700">Health Progress</h3>
        </div>
        <HealthChart labels={labels} bmiData={bmiData} bfpData={bfpData} />
      </section>

      {/* Health Form */}
      <section className="container mx-auto bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center mb-6">
          <FaCalculator className="text-blue-500 mr-2 text-xl" />
          <h2 className="text-xl font-bold text-blue-700">Personal Health Details</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: "Weight (kg)", name: "weight", type: "number", step: "0.1" },
            { label: "Height (m)", name: "height", type: "number", step: "0.01" },
            { label: "Waist (cm)", name: "waist", type: "number" },
            { label: "Neck (cm)", name: "neck", type: "number" },
            { label: "Bone Density", name: "bone_density", type: "number", step: "0.01" },
            {
              label: "Activity Level",
              name: "activity_level",
              type: "select",
              options: [
                { value: "1.2", label: "Sedentary (1.2x)" },
                { value: "1.375", label: "Light (1.375x)" },
                { value: "1.55", label: "Moderate (1.55x)" },
                { value: "1.725", label: "Active (1.725x)" },
              ],
            },
            { label: "Sleep Hours", name: "sleep_hours", type: "range", min: "0", max: "12" },
            { label: "Water Intake (L)", name: "water_intake", type: "range", min: "0", max: "5", step: "0.1" },
            formData.gender === "Female" && { label: "Hip (cm)", name: "hip", type: "number" },
          ].filter(Boolean).map((item) => (
            <div key={item.name} className="mb-3">
              <label className="block text-sm font-medium text-gray-700">{item.label}</label>
              {item.type === "select" ? (
                <select
                  name={item.name}
                  value={formData[item.name]}
                  onChange={handleChange}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  {item.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : item.type === "range" ? (
                <div>
                  <input
                    type={item.type}
                    name={item.name}
                    min={item.min}
                    max={item.max}
                    step={item.step}
                    value={formData[item.name]}
                    onChange={handleChange}
                    className="mt-1 w-full"
                  />
                  <p className="text-xs text-gray-500">Current: {formData[item.name]} {item.name === 'sleep_hours' ? 'hrs' : 'L'}</p>
                </div>
              ) : (
                <input
                  type={item.type}
                  name={item.name}
                  step={item.step}
                  value={formData[item.name]}
                  onChange={handleChange}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              )}
            </div>
          ))}
        </div>

        <button
          onClick={calculateMetrics}
          className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white py-3 rounded-md font-semibold transition duration-200 ease-in-out shadow-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 flex items-center justify-center gap-2"
        >
          <FaCalculator size={18} />
          Calculate & Analyze
        </button>
      </section>

      {/* Results */}
      {results && (
        <section className="container mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg relative">
          <div className="flex items-center mb-6">
            <FaChartLine className="text-indigo-500 mr-2 text-xl" />
            <h3 className="text-xl font-semibold text-indigo-700">Health Metrics</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries({
              "BMI": results.bmi.toFixed(2),
              "Body Fat %": results.bfp.toFixed(2) + "%",
              "Lean Body Mass": results.lbm.toFixed(2) + " kg",
              "BMR": results.bmr.toFixed(0) + " kcal/day",
              "TDEE": results.tdee.toFixed(0) + " kcal/day",
              "WHtR": `${results.whtr.toFixed(2)} (${results.risk_level})`,
              "Metabolic Age": results.metabolic_age.toFixed(0) + " yrs",
              "Ideal Weight": results.ideal_weight.toFixed(2) + " kg",
              "Bone T-score": results.t_score.toFixed(2),
              "Protein Intake": results.protein.toFixed(0) + " g/day",
              "Carbs Intake": results.carbs.toFixed(0) + " g/day",
              "Fats Intake": results.fats.toFixed(0) + " g/day",
              "Hydration": results.hydration_status,
              "Sleep Quality": results.sleep_status
            }).map(([key, value]) => (
              <div key={key} className="bg-gray-50 rounded-md shadow-sm p-4 hover:shadow-md transition duration-200 ease-in-out">
                <p className="font-semibold text-gray-700">{key}</p>
                <p className="text-gray-900">{value}</p>
              </div>
            ))}
          </div>

          <button
            onClick={clearResults}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-600 transition duration-200 ease-in-out focus:outline-none"
          >
            <FaTimesCircle size={20} />
          </button>
        </section>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around py-3 z-50 shadow-md">
        <button onClick={() => navigate("/dashboard")} className="flex flex-col items-center text-green-600 hover:text-green-700 focus:outline-none">
          <FaHeartbeat size={24} />
          <span className="text-xs mt-1">Physical</span>
        </button>
        <button onClick={() => navigate("/MentalHealth")} className="flex flex-col items-center text-pink-600 hover:text-pink-700 focus:outline-none">
          <FaBrain size={24} />
          <span className="text-xs mt-1">Mental</span>
        </button>
        <button onClick={() => navigate("/SymptomBased")} className="flex flex-col items-center text-yellow-600 hover:text-yellow-700 focus:outline-none">
          <FaStethoscope size={24} />
          <span className="text-xs mt-1">Symptoms</span>
        </button>
        <button onClick={() => navigate('/Settings')} className="flex flex-col items-center text-gray-600 hover:text-gray-700 focus:outline-none">
          <FaCog size={24} />
          <span className="text-xs mt-1">Settings</span>
        </button>
      </nav>
    </div>
  );
};

export default Dashboard;