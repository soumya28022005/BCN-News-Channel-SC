'use client';
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
    <div className="fixed bottom-0 w-full bg-[#111118] border-t border-[#1E1E2E] p-4 z-50 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
      <p className="text-[#94A3B8] text-sm">
        We use cookies to improve your experience and serve personalized ads.
      </p>
      <button 
        onClick={acceptCookies} 
        className="bg-[#E53E3E] text-white px-6 py-2 rounded text-sm font-medium hover:bg-red-700 transition-colors whitespace-nowrap"
      >
        Accept
      </button>
    </div>
  );
}