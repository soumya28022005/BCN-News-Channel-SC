"use client";
import { useState, useEffect } from "react";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) setShow(true);
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      width: "100%",
      background: "#161B22",
      padding: "15px",
      borderTop: "1px solid #30363D",
      zIndex: 999
    }}>
      <p style={{ fontSize: "13px", marginBottom: "10px", color: "white" }}>
        We use cookies to improve your experience and serve personalized ads.
      </p>

      <button onClick={acceptCookies} style={{
        background: "#FFB703",
        border: "none",
        padding: "8px 16px",
        cursor: "pointer",
        fontWeight: "600",
        color: "black"
      }}>
        Accept
      </button>
    </div>
  );
}