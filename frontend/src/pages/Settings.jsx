import React, { useState, useEffect, useCallback, memo } from "react";
import { Switch } from "@headlessui/react";
import { useNavigate } from 'react-router-dom';
import {
  FaHeartbeat, FaBrain, FaStethoscope, FaCog, FaSignOutAlt
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useTheme } from "../pages/ThemeContext";

const accentColorMap = {
  indigo: "from-indigo-600 to-indigo-700 text-indigo-700",
  purple: "from-purple-600 to-purple-700 text-purple-700",
  blue: "from-blue-600 to-blue-700 text-blue-700",
  green: "from-green-600 to-green-700 text-green-700",
  yellow: "from-yellow-600 to-yellow-700 text-yellow-700",
  red: "from-red-600 to-red-700 text-red-700",
};

const SettingsPage = () => {
  const { darkMode, setDarkMode } = useTheme();
  const [user, setUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  // Settings state
  const [metricUnits, setMetricUnits] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState("en");
  const [smartDevice, setSmartDevice] = useState(false);
  const [fontSize, setFontSize] = useState("medium");
  const [accentColor, setAccentColor] = useState("indigo");
  const [autoSync, setAutoSync] = useState(true);
  const [locationServices, setLocationServices] = useState(false);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setUser(currentUser);
    loadSettings(currentUser.uid);
  }, [navigate]);

  const loadSettings = async (uid) => {
    try {
      const ref = doc(db, "users", uid, "settings", "preferences");
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setDarkMode(data.darkMode ?? false);
        setMetricUnits(data.metricUnits ?? true);
        setNotifications(data.notifications ?? true);
        setLanguage(data.language ?? "en");
        setSmartDevice(data.smartDevice ?? false);
        setFontSize(data.fontSize ?? "medium");
        setAccentColor(data.accentColor ?? "indigo");
        setAutoSync(data.autoSync ?? true);
        setLocationServices(data.locationServices ?? false);
      }
    } catch (error) {
      toast.error("Failed to load settings.");
    }
  };

  const saveSettings = useCallback(async () => {
    if (!user) return;
    setSaving(true);
    try {
      const ref = doc(db, "users", user.uid, "settings", "preferences");
      await setDoc(ref, {
        darkMode,
        metricUnits,
        notifications,
        language,
        smartDevice,
        fontSize,
        accentColor,
        autoSync,
        locationServices,
      });
      toast.success("Settings saved!");
    } catch (error) {
      toast.error("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  }, [user, darkMode, metricUnits, notifications, language, smartDevice, fontSize, accentColor, autoSync, locationServices]);

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to log out?")) return;
    try {
      await signOut(auth);
      toast.success("Logged out");
      navigate("/login");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  // Apply font size globally
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("text-sm", "text-base", "text-lg");
    root.classList.add(
      fontSize === "small" ? "text-sm" :
      fontSize === "large" ? "text-lg" :
      "text-base"
    );
  }, [fontSize]);

  // Request notification permission if enabled
  useEffect(() => {
    if (notifications && Notification.permission !== "granted") {
      Notification.requestPermission().then(permission => {
        if (permission !== "granted") {
          toast.error("Notification permission denied.");
        }
      });
    }
  }, [notifications]);

  // Handle location access
  useEffect(() => {
    if (locationServices && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        pos => console.log("Location:", pos.coords),
        err => toast.error("Location error: " + err.message)
      );
    }
  }, [locationServices]);

  const accentClasses = accentColorMap[accentColor] || accentColorMap.indigo;

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-blue-50 to-purple-200 text-gray-900"} py-10 px-6`}>
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl">
        <h2 className="text-4xl font-extrabold mb-6 text-center">⚙️ Settings</h2>

        {/* Preferences */}
        <section className="mb-12">
          <h3 className="text-2xl font-semibold mb-6">🎛️ Preferences</h3>
          <div className="space-y-6">
            <Toggle label="🌗 Dark Mode" value={darkMode} onChange={setDarkMode} />
            <Dropdown label="🌡️ Metric Units" value={metricUnits} onChange={setMetricUnits} options={{ en: "CM", es: "INCH", fr: "M", de: "FOOT" }} />
            <Toggle label="🔔 Notifications" value={notifications} onChange={setNotifications} />
            <Dropdown label="🌍 Language" value={language} onChange={setLanguage} options={{ en: "English", es: "Español", fr: "Français", de: "Deutsch" }} />
            <button
  onClick={() => {
    const clientId = "YOUR_CLIENT_ID";
    const redirectUri = encodeURIComponent("http://localhost:3000/fitbit/callback");
    const scope = "activity heartrate sleep";
    window.location.href = `https://www.fitbit.com/oauth2/authorize?response_type=token&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&expires_in=604800`;
  }}
  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
>
  🔗 Connect Fitbit
</button>


          </div>
        </section>

        {/* Appearance */}
        <section className="mb-12">
          <h3 className="text-2xl font-semibold mb-6">🎨 Appearance</h3>
          <div className="space-y-6">
            <Dropdown label="✒️ Font Size" value={fontSize} onChange={setFontSize} options={{ small: "Small", medium: "Medium", large: "Large" }} />
            <Dropdown label="🌈 Accent Color" value={accentColor} onChange={setAccentColor} options={{ indigo: "Indigo", purple: "Purple", blue: "Blue", green: "Green", yellow: "Yellow", red: "Red" }} />
          </div>
        </section>

        {/* Sync */}
        <section className="mb-12">
          <h3 className="text-2xl font-semibold mb-6">🔄 Data & Sync</h3>
          <div className="space-y-6">
            <Toggle label="🔄 Auto Sync Data" value={autoSync} onChange={setAutoSync} />
            <Toggle label="📍 Location Services" value={locationServices} onChange={setLocationServices} />
          </div>
        </section>

        {/* Account */}
        <section className="mb-12">
          <h3 className="text-2xl font-semibold mb-6">👤 Account</h3>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-8 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700"
          >
            <FaSignOutAlt /> Logout
          </button>
        </section>

        {/* Save Button */}
        <div className="text-center">
          <button
            onClick={saveSettings}
            disabled={saving}
            className={`px-8 py-4 bg-gradient-to-br ${accentClasses} text-white text-xl rounded-full font-semibold shadow-xl hover:opacity-90 transition-all ${saving ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {saving ? "Saving..." : "💾 Save Changes"}
          </button>
        </div>
      </div>

      {/* Bottom Nav */}
      <nav className="sticky bottom-0 z-50 bg-white/90 backdrop-blur-md shadow-inner flex justify-around py-4 border-t mt-12 dark:bg-gray-700">
        <MemoNavButton to="/dashboard" icon={<FaHeartbeat size={28} />} color="text-green-700" />
        <MemoNavButton to="/MentalHealth" icon={<FaBrain size={28} />} color="text-pink-700" />
        <MemoNavButton to="/SymptomBased" icon={<FaStethoscope size={28} />} color="text-yellow-700" />
        <MemoNavButton to="/Settings" icon={<FaCog size={28} />} color={accentClasses.split(" ").pop()} />
      </nav>
    </div>
  );
};

export default SettingsPage;

const Toggle = ({ label, value, onChange }) => (
  <div className="flex items-center justify-between">
    <span className="text-lg font-medium text-gray-700 dark:text-gray-200">{label}</span>
    <Switch
      checked={value}
      onChange={onChange}
      className={`${value ? "bg-purple-600" : "bg-gray-300"} relative inline-flex h-8 w-14 items-center rounded-full transition`}
    >
      <span className={`${value ? "translate-x-6" : "translate-x-1"} inline-block h-5 w-5 transform rounded-full bg-white`} />
    </Switch>
  </div>
);

const Dropdown = ({ label, value, onChange, options }) => (
  <div className="flex items-center justify-between">
    <span className="text-lg font-medium text-gray-700 dark:text-gray-200">{label}</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-600 dark:bg-gray-700 dark:text-white"
    >
      {Object.entries(options).map(([key, label]) => (
        <option key={key} value={key}>{label}</option>
      ))}
    </select>
  </div>
);

const MemoNavButton = memo(({ to, icon, color }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(to)}
      className={`flex items-center justify-center p-2 rounded-full hover:bg-gray-200 transition ${color}`}
    >
      {icon}
    </button>
  );
});
MemoNavButton.displayName = "MemoNavButton";
