export const API_URL = "http://127.0.0.1:8000";

export const getHealthPrediction = async (inputData) => {
  const response = await fetch(`${API_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(inputData),
  });
  return response.json();
};
