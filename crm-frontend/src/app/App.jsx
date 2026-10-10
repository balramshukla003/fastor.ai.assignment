import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import SignupPage from "../features/auth/pages/SignupPage";
import OtpPage from "../features/auth/pages/OtpPage";
import HomePage from "../features/home/pages/HomePage";
import ProductPage from "../features/product/pages/ProductPage";
import ProfilePage from "../features/profile/pages/ProfilePage";
import { useAuth } from "../context/AuthContext";
import { AppShell } from "../components/layout/AppShell";

function Protected({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  return user ? children : <Navigate to="/signup" replace state={{ from: location.pathname }} />;
}

export default function App() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<Navigate to={user ? "/home" : "/signup"} replace />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/verify-otp" element={<OtpPage />} />
      <Route path="/home" element={<Protected><AppShell><HomePage /></AppShell></Protected>} />
      <Route path="/product/:productId" element={<Protected><AppShell><ProductPage /></AppShell></Protected>} />
      <Route path="/profile" element={<Protected><AppShell><ProfilePage /></AppShell></Protected>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}