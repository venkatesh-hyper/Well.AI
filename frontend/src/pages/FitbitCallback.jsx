import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

const FitbitCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hash.get('access_token');
    const user = auth.currentUser;

    if (accessToken && user) {
      const saveToken = async () => {
        await setDoc(doc(db, "users", user.uid, "fitbit", "auth"), {
          accessToken,
          timestamp: new Date().toISOString(),
        });
        navigate('/settings');
      };
      saveToken();
    } else {
      navigate('/settings');
    }
  }, [navigate]);

  return <div>Connecting to Fitbit...</div>;
};

export default FitbitCallback;
