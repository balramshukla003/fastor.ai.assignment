import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import { authService } from "../../../services/auth/authService";
import { useAuth } from "../../../context/AuthContext";

export default function OtpPage() {
  const [digits, setDigits] = useState(["","","","","",""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [seconds, setSeconds] = useState(30);
  const inputs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { pendingPhone, completeLogin, beginSignup } = useAuth();
  const pending = (() => { try { return JSON.parse(pendingPhone || sessionStorage.getItem("fastor_pending_phone") || "null"); } catch { return null; } })();

  useEffect(() => {
    if (!pending?.phone) navigate("/signup", { replace: true });
  }, [pending?.phone, navigate]);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = window.setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [seconds]);

  const updateDigit = (index, value) => {
    const clean = value.replace(/\D/g, "");
    if (clean.length > 1) {
      const next = [...digits];
      clean.slice(0, 6 - index).split("").forEach((digit, offset) => { next[index + offset] = digit; });
      setDigits(next);
      inputs.current[Math.min(index + clean.length, 5)]?.focus();
      return;
    }
    const next = [...digits]; next[index] = clean; setDigits(next);
    if (clean && index < 5) inputs.current[index + 1]?.focus();
  };

  const submit = async (event) => {
    event.preventDefault();
    const otp = digits.join("");
    if (otp.length !== 6) return setError("Enter all six digits.");
    setError(""); setLoading(true);
    try {
      const data = await authService.login({ phone: pending.phone, dialCode: pending.dialCode || "91", otp });
      completeLogin(data);
      navigate(location.state?.from || "/home", { replace: true });
    } catch (e) {
      setError(e.message || "OTP verification failed. Check the code and try again.");
    } finally { setLoading(false); }
  };

  const resend = async () => {
    if (seconds > 0 || !pending?.phone) return;
    setError(""); setLoading(true);
    try {
      await authService.signup({ phone: pending.phone, dialCode: pending.dialCode || "91" });
      setDigits(["","","","","",""]); setSeconds(30); inputs.current[0]?.focus();
    } catch (e) { setError(e.message || "Could not resend OTP."); }
    finally { setLoading(false); }
  };

  return <main className="auth-page">
    <section className="auth-card">
      <button className="back-button" onClick={() => navigate("/signup")} aria-label="Back to signup"><ArrowLeft size={21}/></button>
      <div className="auth-copy"><p className="eyebrow">PHONE VERIFICATION</p><h1>6-digit code</h1><p>Please enter the code we've sent to</p><strong className="phone-display">+{pending?.dialCode || "91"} {pending?.phone || ""}</strong></div>
      <form className="auth-form otp-form" onSubmit={submit}>
        <div className="otp-inputs" aria-label="Six digit verification code">
          {digits.map((digit, index) => <input key={index} ref={(el) => { inputs.current[index] = el; }} value={digit} aria-label={`OTP digit ${index + 1}`} inputMode="numeric" autoComplete={index === 0 ? "one-time-code" : "off"} maxLength={1} onChange={(e) => updateDigit(index, e.target.value)} onKeyDown={(e) => { if (e.key === "Backspace" && !digits[index] && index > 0) inputs.current[index - 1]?.focus(); }} />)}
        </div>
        <p className="resend-line">Didn't receive a code? <button type="button" onClick={resend} disabled={seconds > 0 || loading}>{seconds > 0 ? `(${`00:${String(seconds).padStart(2, "0")}`})` : "Resend code"}</button></p>
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="auth-submit"><PrimaryButton type="submit" loading={loading}>Continue</PrimaryButton></div>
      </form>
    </section>
  </main>;
}