# from fastapi import FastAPI
# from pydantic import BaseModel

# app = FastAPI()

# @app.get("/")
# def read_root():
#     return {"message": "Backend API working"}

# backend/app/main.py

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import joblib
import numpy as np
from pydantic import BaseModel

app = FastAPI()

# CORS for React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models once
svm8020 = joblib.load("app/models/svm8020.pkl")
randfor = joblib.load("app/models/RandomForest8020.pkl")

class SymptomInput(BaseModel):
    inputs: list

@app.post("/predict-disease")
def predict_disease(symptom_data: SymptomInput):
    arr = np.array(symptom_data.inputs).reshape(1, -1)
    pred1 = svm8020.predict(arr)[0]
    pred2 = randfor.predict(arr)[0]
    return {"svm8020": pred1, "randomForest": pred2}
