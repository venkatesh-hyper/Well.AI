import React, { useState } from "react";
import { BadgeCheck, AlertTriangle, Loader2 } from "lucide-react";

const SymptomsBased = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const symptomsList = [
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

  const handleSubmit = async () => {
    if (selectedSymptoms.length === 0) {
      alert("Please select at least one symptom.");
      return;
    }

    const binaryInput = symptomsList.map(symptom =>
      selectedSymptoms.includes(symptom) ? 1 : 0
    );

    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/predict-disease", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputs: binaryInput }),
      });
      const data = await response.json();
      setPrediction(data);
    } catch (error) {
      console.error("Prediction error:", error);
      alert("Server error. Is your backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleSymptomChange = (symptom) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-pink-100 to-cyan-100">
      <h1 className="text-4xl font-bold mb-4 text-center text-gray-800">Disease Predictor</h1>
      <p className="text-md text-center text-gray-600 mb-6">
        Select your symptoms and click <strong>Predict</strong> to get your results powered by AI.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
        {symptomsList.map(symptom => (
          <label
            key={symptom}
            className={`cursor-pointer border rounded-full px-4 py-1 text-sm text-gray-700 
            ${selectedSymptoms.includes(symptom)
              ? "bg-green-200 border-green-400 font-semibold"
              : "bg-white hover:bg-gray-200"}
            `}
          >
            <input
              type="checkbox"
              className="hidden"
              checked={selectedSymptoms.includes(symptom)}
              onChange={() => handleSymptomChange(symptom)}
            />
            {symptom.replace(/_/g, " ")}
          </label>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin w-5 h-5" /> Predicting...
          </>
        ) : (
          <>
            <BadgeCheck className="w-5 h-5" /> Predict
          </>
        )}
      </button>

      {prediction && (
        <div className="mt-8 p-6 bg-white shadow-xl rounded-xl max-w-xl mx-auto text-center">
          <h2 className="text-xl font-bold mb-2 text-green-700">🧠 Predicted Results:</h2>
          <p className="text-lg text-gray-800">
            You may have:{" "}
            <span className="font-semibold text-blue-600">{prediction.svm8020}</span> or{" "}
            <span className="font-semibold text-purple-600">{prediction.randomForest}</span>
          </p>
          <div className="mt-4 text-sm text-yellow-600 flex items-center justify-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            This is a machine learning-based prediction. Please consult a doctor for accurate diagnosis.
          </div>
        </div>
      )}
    </div>
  );
};

export default SymptomsBased;
