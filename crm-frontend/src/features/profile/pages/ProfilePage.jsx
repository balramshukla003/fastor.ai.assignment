import { CalendarDays, Mail, MapPin, Phone, ShieldCheck, UserRound, LogOut, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import ImageWithFallback from "../../../components/ui/ImageWithFallback";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const date = user?.member_since ? new Date(user.member_since).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
  const rows = [
    { label: "Full name", value: user?.user_name || "Guest", icon: UserRound },
    { label: "Mobile number", value: `${user?.dial_code?.trim() ? `+${user.dial_code.trim()} ` : ""}${user?.user_mobile || "—"}`, icon: Phone },
    { label: "Email address", value: user?.user_email || "Not provided", icon: Mail },
    { label: "Gender", value: user?.user_gender === "M" ? "Male" : user?.user_gender === "F" ? "Female" : "Not provided", icon: UserRound },
    { label: "Member since", value: date, icon: CalendarDays },
    { label: "Location", value: user?.last_known_location || "Not shared", icon: MapPin }
  ];
  return <section className="profile-page">
    <button className="back-button profile-back" onClick={() => navigate("/home")}><ArrowLeft size={19}/> <span>Back to home</span></button>
    <div className="profile-heading"><p className="eyebrow">YOUR ACCOUNT</p><h1>My Profile</h1><p>View your Fastor account details.</p></div>
    <div className="profile-card">
      <div className="profile-hero"><ImageWithFallback src={user?.user_image} fallback="/assets/restaurant-fallback.svg" alt="Profile avatar" className="profile-avatar"/><div><h2>{user?.user_name || "Guest"}</h2><p>{user?.user_email || "Fastor member"}</p><span className="verified-pill"><ShieldCheck size={14}/> {user?.mobile_verified ? "Mobile verified" : "Verification pending"}</span></div></div>
      <div className="profile-fields">{rows.map(({ label, value, icon: Icon }) => <div className="profile-field" key={label}><span className="profile-field-icon"><Icon size={18}/></span><div><span>{label}</span><strong>{value}</strong></div></div>)}</div>
      <button className="logout-button" onClick={() => { logout(); navigate("/signup", { replace: true }); }}><LogOut size={17}/> Sign out</button>
    </div>
    <p className="profile-note">Only profile fields returned by the login API are displayed. Sensitive fields such as password and access token are never shown.</p>
  </section>;
}