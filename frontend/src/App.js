import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import Welcome from "./pages/Welcome";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import Loading from "./pages/Loading";
import Dashboard from './pages/Dashboard';
import MentalHealth from "./pages/MentalHealth";
import SymptomBased from "./pages/SymptomsBased";
import Settings from "./pages/Settings";
const App = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <Loading />;

  return (
    <Router>
      <Routes>
      <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
          <Route path="Dashboard" element={<Dashboard />} />
            <Route path="mentalhealth" element={<MentalHealth />} />
            <Route path="symptomsbased" element={<SymptomBased />} />
            <Route path="settings" element={<Settings />} />
        {/* Add more routes here */}
      </Routes>
    </Router>
  );
};

export default App;



