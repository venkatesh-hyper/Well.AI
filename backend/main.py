from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import joblib
import gdown
import os
import numpy as np
import pandas as pd
import logging

# === App Setup ===
app = FastAPI()

# === Logging ===
logging.basicConfig(level=logging.INFO)

# === CORS ===
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: Replace with allowed domains in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Input Models ===
class SymptomRequest(BaseModel):
    symptoms: list[str]

class DepressionRequest(BaseModel):
    Gender: str
    Age: int = Field(..., ge=10, le=100)
    Sleep_Duration: str
    Work_Study_Hours: int = Field(..., ge=0, le=24)
    Financial_Stress: int = Field(..., ge=0, le=10)
    Academic_Work_Pressure: int = Field(..., ge=0, le=10)
    Job_Study_Satisfaction: int = Field(..., ge=0, le=10)
    Family_History_of_Mental_Illness: str
    Suicidal_Thoughts: str

# === Model Loading ===
def download_model_from_drive():
    url = "https://drive.google.com/uc?id=1OSRR2QRy3sBrne9A30OqOkMZUDSeX9Ck&export=download"
    output = "ensemble_model.pkl"
    if not os.path.exists(output):
        gdown.download(url, output, quiet=False)
    return joblib.load(output)

# === Load Models & Scalers ===
try:
    svm_8020 = joblib.load("models/svm_8020.pkl")
    depression_model = download_model_from_drive()
    scaler = joblib.load("models/scaler.pkl")
except Exception as e:
    logging.exception("Model loading failed: %s", str(e))
    raise

# === Static Symptom List ===
all_symptoms = [
    'itching', 'skin_rash', 'nodal_skin_eruptions', 'continuous_sneezing', 'chills', 'joint_pain',
    'stomach_pain', 'vomiting', 'fatigue', 'weight_loss', 'anxiety', 'high_fever', 'headache',
    'nausea', 'loss_of_appetite', 'pain_behind_the_eyes', 'back_pain', 'constipation',
    'abdominal_pain', 'diarrhoea', 'yellow_urine', 'yellowing_of_eyes', 'acute_liver_failure',
    'swelling_of_stomach', 'malaise', 'blurred_and_distorted_vision', 'phlegm', 'throat_irritation',
    'sinus_pressure', 'runny_nose', 'chest_pain', 'weakness_in_limbs', 'pain_during_bowel_movements',
    'neck_pain', 'dizziness', 'cramps', 'obesity', 'puffy_face_and_eyes', 'enlarged_thyroid',
    'brittle_nails', 'excessive_hunger', 'drying_and_tingling_lips', 'slurred_speech', 'muscle_weakness',
    'stiff_neck', 'loss_of_balance', 'unsteadiness', 'weakness_of_one_body_side', 'loss_of_smell',
    'bladder_discomfort', 'continuous_feel_of_urine', 'internal_itching', 'toxic_look_(typhos)',
    'depression', 'irritability', 'altered_sensorium', 'red_spots_over_body', 'belly_pain',
    'increased_appetite', 'lack_of_concentration', 'visual_disturbances'
]

# === Utility Functions ===

def encode_symptoms(selected_symptoms: list[str]):
    return np.array([1 if symptom in selected_symptoms else 0 for symptom in all_symptoms]).reshape(1, -1)

def preprocess_depression_input(data: DepressionRequest):
    input_data = {
        "Gender": {"Male": 1, "Female": 0}.get(data.Gender, 0),
        "Age": data.Age,
        "Sleep Duration": {
            "Less than 5 hours": 4.0, "5-6 hours": 5.5, "6-7 hours": 6.5,
            "7-8 hours": 7.5, "8-9 hours": 8.5, "9-11 hours": 10.0, "More than 8 hours": 9.0
        }.get(data.Sleep_Duration, 0),
        "Work/Study Hours": data.Work_Study_Hours,
        "Financial Stress": data.Financial_Stress,
        "Academic/Work Pressure": data.Academic_Work_Pressure,
        "Job/Study Satisfaction": data.Job_Study_Satisfaction,
        "Family History of Mental Illness": {"Yes": 1, "No": 0}.get(data.Family_History_of_Mental_Illness, 0),
        "Have you ever had suicidal thoughts ?": {"Yes": 1, "No": 0}.get(data.Suicidal_Thoughts, 0)
    }

    df = pd.DataFrame([input_data])
    df["Pressure"] = df["Academic/Work Pressure"]
    df["Satisfaction"] = df["Job/Study Satisfaction"]

    features = [
        "Gender", "Age", "Sleep Duration", "Work/Study Hours",
        "Pressure", "Financial Stress", "Satisfaction",
        "Family History of Mental Illness", "Have you ever had suicidal thoughts ?"
    ]
    return scaler.transform(df[features].fillna(0))

# === Routes ===

@app.post("/predict")
def predict_disease(request: SymptomRequest):
    if not request.symptoms:
        raise HTTPException(status_code=400, detail="No symptoms provided")
    try:
        input_vector = encode_symptoms(request.symptoms)
        prediction = svm_8020.predict(input_vector)[0]
        return {"svm8020": prediction}
    except Exception as e:
        logging.exception("Disease prediction failed: %s", str(e))
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.post("/predict_depression")
def predict_depression(data: DepressionRequest):
    try:
        processed_input = preprocess_depression_input(data)
        prediction = depression_model.predict(processed_input)[0]
        confidence = depression_model.predict_proba(processed_input)[0][1]
        return {
            "prediction": int(prediction),
            "confidence": float(round(confidence, 4))
        }
    except Exception as e:
        logging.exception("Depression prediction failed for input %s", data.dict())
        raise HTTPException(status_code=500, detail=f"Depression prediction failed: {str(e)}")
