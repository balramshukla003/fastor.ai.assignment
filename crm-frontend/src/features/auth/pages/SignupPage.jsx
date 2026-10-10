import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import { authService } from "../../../services/auth/authService";
import { useAuth } from "../../../context/AuthContext";

export default function SignupPage() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { beginSignup } = useAuth();

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (!/^[0-9]{10}$/.test(phone)) return setError("Enter a valid 10-digit mobile number.");
    setLoading(true);
    try {
      await authService.signup({ phone, dialCode: "91" });
      beginSignup(phone, "91");
      navigate("/verify-otp");
    } catch (e) {
      setError(e.message || "Unable to send OTP. Please try again.");
    } finally { setLoading(false); }
  };

  return <main className="auth-page">
    <section className="auth-card">
      <button className="back-button" onClick={() => navigate(-1)} aria-label="Go back"><ArrowLeft size={21}/></button>
      <div className="auth-copy"><p className="eyebrow">WELCOME TO FASTOR</p><h1>Sign Up to Fastor</h1><p>Let us know your mobile number and we will send you an OTP for verification.</p></div>
      <form onSubmit={submit} className="auth-form">
        <label className="phone-field"><span>+91</span><span className="phone-divider"/><input aria-label="Mobile number" inputMode="numeric" autoComplete="tel-national" placeholder="00000 00000" value={phone} maxLength={10} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}/></label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="auth-submit"><PrimaryButton type="submit" loading={loading}>Get OTP</PrimaryButton><p className="legal-copy">By clicking, I accept the <a href="#terms">Terms &amp; Conditions</a> and <a href="#privacy">Privacy Policy</a>.</p></div>
      </form>
    </section>
  </main>;
}