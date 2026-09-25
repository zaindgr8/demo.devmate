"use client";

import React, { useState } from "react";
import { authenticateForm, FORMS } from "@/lib/forms";

export default function LockScreen({ fixedForm, onUnlock }) {
  const [username, setUsername] = useState(fixedForm ? fixedForm.username : "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setError(false);

    const userToVerify = fixedForm ? fixedForm.username : username;
    const authenticated = authenticateForm(userToVerify, password);

    if (authenticated) {
      if (fixedForm && authenticated.id !== fixedForm.id) {
        // Entered credentials belong to a different form than the fixed route
        setError("These credentials belong to a different form.");
        triggerShake();
        return;
      }
      onUnlock(authenticated);
    } else {
      setError("Invalid username or password. Please try again.");
      triggerShake();
    }
  }

  function triggerShake() {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  }

  return (
    <div
      className="devmate-pattern relative"
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        display: "flex",
        flexDirection: "column",
        padding: "16px",
      }}
    >
      {/* Devmate Top Accent Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#c0392b] via-[#e74c3c] to-[#c0392b] z-50"></div>

      <div
        style={{
          width: "100%",
          maxWidth: "448px",
          margin: "0 auto",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <form
          onSubmit={handleSubmit}
          className={`space-y-8 transition-transform ${
            shake ? "animate-bounce" : ""
          }`}
        >
          {/* Lock Icon & Header */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50 border border-red-100 mb-4 text-[#c0392b] shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-light text-black mb-2 tracking-wide uppercase">
              {fixedForm ? fixedForm.title : "PORTAL ACCESS"}
            </h1>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">
              {fixedForm ? "Restricted Access Form" : "Enter credentials to unlock"}
            </p>
            <div className="w-12 h-0.5 bg-gradient-to-r from-[#c0392b] to-[#e74c3c] mx-auto rounded-full"></div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {!fixedForm && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Available Forms ({Object.keys(FORMS).length})
                  </span>
                  <span className="text-[11px] text-gray-400">Click to select</span>
                </div>
                <div className="space-y-2">
                  {Object.values(FORMS).map((f) => {
                    const isSelected =
                      (username || "").toLowerCase() === f.username.toLowerCase();
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => {
                          setUsername(f.username);
                          setError(false);
                        }}
                        className={`w-full flex items-center justify-between p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
                          isSelected
                            ? "border-[#c0392b] bg-red-50/70 text-gray-900 shadow-sm ring-1 ring-[#c0392b]/30"
                            : "border-gray-200 bg-gray-50/70 hover:bg-red-50/30 hover:border-red-200 text-gray-900"
                        }`}
                      >
                        <div className="min-w-0 pr-3">
                          <div className="text-xs font-semibold tracking-wide text-gray-900">
                            {f.title}
                          </div>
                          <div
                            className={`text-[11px] mt-0.5 ${
                              isSelected ? "text-[#c0392b]" : "text-gray-500"
                            }`}
                          >
                            Username:{" "}
                            <span className="font-mono font-medium">{f.username}</span>
                          </div>
                        </div>
                        <div className="shrink-0 flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                              isSelected
                                ? "bg-[#c0392b] text-white shadow-xs"
                                : "bg-gray-200 text-gray-700"
                            }`}
                          >
                            {isSelected ? "Active" : "Select"}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {!fixedForm && (
              <div>
                <label
                  htmlFor="portal-username"
                  className="block text-sm font-medium text-black mb-2"
                >
                  Username
                </label>
                <input
                  id="portal-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Enter assigned username"
                  autoComplete="username"
                  className="w-full px-0 py-3 border-0 border-b border-gray-300 bg-transparent text-black placeholder-gray-400 focus:outline-none focus:border-[#c0392b] transition-colors"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="portal-password"
                className="block text-sm font-medium text-black mb-2"
              >
                Password
              </label>
              <input
                id="portal-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter password"
                autoComplete="current-password"
                className="w-full px-0 py-3 border-0 border-b border-gray-300 bg-transparent text-black placeholder-gray-400 focus:outline-none focus:border-[#c0392b] transition-colors"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-center p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-xs text-[#c0392b] font-medium">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-[#c0392b] to-[#e74c3c] text-white font-medium hover:from-[#961918] hover:to-[#c0392b] focus:outline-none focus:ring-2 focus:ring-[#c0392b] focus:ring-offset-2 transition-all shadow-[0_4px_16px_rgba(192,57,43,0.3)] hover:shadow-[0_6px_20px_rgba(192,57,43,0.4)] cursor-pointer rounded-lg"
          >
            Unlock Form
          </button>

          {/* Direct Links */}
          <div className="pt-2 text-center border-t border-gray-100">
            <p className="text-[11px] text-gray-400 uppercase tracking-widest mb-2 font-medium">
              Direct Form URLs
            </p>
            <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1">
              {Object.values(FORMS).map((f) => (
                <a
                  key={f.id}
                  href={`/${f.id}`}
                  className="text-xs text-gray-600 hover:text-[#c0392b] font-mono underline underline-offset-4 decoration-gray-300 hover:decoration-[#c0392b] transition-colors"
                >
                  /{f.id}
                </a>
              ))}
            </div>
          </div>
        </form>
      </div>

      {/* Footer */}
      <footer
        style={{
          width: "100%",
          paddingTop: "24px",
          paddingBottom: "24px",
          borderTop: "1px solid #e5e7eb",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>
          Powered by{" "}
          <a
            href="https://devmatesolutions.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#374151" }}
            className="underline hover:text-[#c0392b] transition-colors"
          >
            devmatesolutions.com
          </a>
        </p>
        <p style={{ fontSize: "12px", color: "#6b7280" }}>
          Join the AI Movement —{" "}
          <a
            href="https://aifounderhub.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#374151" }}
            className="underline hover:text-[#c0392b] transition-colors"
          >
            aifounderhub.com
          </a>
        </p>
      </footer>
    </div>
  );
}
