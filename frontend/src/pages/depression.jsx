import React, { useState } from 'react';
import axios from 'axios';

const DepressionPrediction = () => {
  const [formData, setFormData] = useState({
    Gender: 'Male',
    Age: 25,
    Sleep_Duration: '7-8 hours',
    Work_Study_Hours: 40,
    Financial_Stress: 5,
    Academic_Work_Pressure: 5,
    Job_Study_Satisfaction: 5,
    Family_History_of_Mental_Illness: 'No',
    Suicidal_Thoughts: 'No',
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const val = type === 'number' ? parseInt(value) : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post('http://localhost:8000/predict_depression', formData);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert('Prediction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Depression Predictor</h2>
      <form onSubmit={handleSubmit}>
        <label>Gender:
          <select name="Gender" value={formData.Gender} onChange={handleChange}>
            <option>Male</option>
            <option>Female</option>
          </select>
        </label>

        <label>Age:
          <input type="number" name="Age" value={formData.Age} onChange={handleChange} min="10" max="100" />
        </label>

        <label>Sleep Duration:
          <select name="Sleep_Duration" value={formData.Sleep_Duration} onChange={handleChange}>
            {["Less than 5 hours", "5-6 hours", "6-7 hours", "7-8 hours", "8-9 hours", "9-11 hours", "More than 8 hours"]
              .map(opt => <option key={opt}>{opt}</option>)}
          </select>
        </label>

        <label>Work/Study Hours:
          <input type="number" name="Work_Study_Hours" value={formData.Work_Study_Hours} onChange={handleChange} min="0" max="100" />
        </label>

        <label>Financial Stress (0-10):
          <input type="range" name="Financial_Stress" value={formData.Financial_Stress} onChange={handleChange} min="0" max="10" />
        </label>

        <label>Academic/Work Pressure (0-10):
          <input type="range" name="Academic_Work_Pressure" value={formData.Academic_Work_Pressure} onChange={handleChange} min="0" max="10" />
        </label>

        <label>Job/Study Satisfaction (0-10):
          <input type="range" name="Job_Study_Satisfaction" value={formData.Job_Study_Satisfaction} onChange={handleChange} min="0" max="10" />
        </label>

        <label>Family History of Mental Illness:
          <select name="Family_History_of_Mental_Illness" value={formData.Family_History_of_Mental_Illness} onChange={handleChange}>
            <option>Yes</option>
            <option>No</option>
          </select>
        </label>

        <label>Have you ever had suicidal thoughts?
          <select name="Suicidal_Thoughts" value={formData.Suicidal_Thoughts} onChange={handleChange}>
            <option>Yes</option>
            <option>No</option>
          </select>
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Predicting..." : "Predict"}
        </button>
      </form>

      {result && (
        <div className="result">
          <h3>Prediction Result:</h3>
          <p>
            {result.prediction === 1 ? (
              <span style={{ color: 'red' }}>High likelihood of depression.</span>
            ) : (
              <span style={{ color: 'green' }}>Low likelihood of depression.</span>
            )}
          </p>
          <p>Model Confidence: {Math.round(result.confidence * 100)}%</p>
        </div>
      )}
    </div>
  );
};

export default DepressionPrediction;
