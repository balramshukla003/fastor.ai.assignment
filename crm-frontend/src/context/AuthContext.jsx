import React, { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

function readUser() {
  try { return JSON.parse(localStorage.getItem("fastor_user") || "null"); }
  catch { return null; }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser);
  const [pendingPhone, setPendingPhone] = useState(() => sessionStorage.getItem("fastor_pending_phone") || "");

  const completeLogin = (data) => {
    const safeUser = { ...data };
    delete safeUser.password;
    if (data.token) localStorage.setItem("fastor_access_token", data.token);
    localStorage.setItem("fastor_user", JSON.stringify(safeUser));
    setUser(safeUser);
    setPendingPhone("");
    sessionStorage.removeItem("fastor_pending_phone");
  };

  const beginSignup = (phone, dialCode) => {
    const pending = JSON.stringify({ phone, dialCode });
    sessionStorage.setItem("fastor_pending_phone", pending);
    setPendingPhone(pending);
  };

  const logout = () => {
    localStorage.removeItem("fastor_access_token");
    localStorage.removeItem("fastor_user");
    setUser(null);
  };

  const value = useMemo(() => ({ user, pendingPhone, beginSignup, completeLogin, logout }), [user, pendingPhone]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used within AuthProvider");
  return value;
}