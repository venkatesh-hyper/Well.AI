# vectorizer.py
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
    # Add remaining symptoms from training if not complete
]

def symptoms_to_vector(symptoms: list[str]) -> list[int]:
    """
    Converts a list of symptoms into a binary feature vector.
    """
    return [1 if symptom in symptoms else 0 for symptom in all_symptoms]
