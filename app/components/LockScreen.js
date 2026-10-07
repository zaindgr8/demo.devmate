"use client";

import React, { useState, useRef, useEffect } from "react";
import { authenticateForm, FORMS } from "@/lib/forms";

export default function LockScreen({ fixedForm, onUnlock }) {
  const [username, setUsername] = useState(fixedForm ? fixedForm.username : "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedForm = Object.values(FORMS).find(
    (f) => (username || "").toLowerCase() === f.username.toLowerCase()
  );

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
              <div className="relative" ref={dropdownRef}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Available Forms ({Object.keys(FORMS).length})
                  </span>
                  <button
                    type="button"
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className="text-[11px] text-[#c0392b] hover:text-[#961918] font-medium transition-colors cursor-pointer"
                  >
                    {dropdownOpen ? "Hide options ▲" : "Reveal options ▼"}
                  </button>
                </div>

                {/* Dropdown Trigger */}
                <button
                  type="button"
                  id="form-dropdown-trigger"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  aria-expanded={dropdownOpen}
                  aria-haspopup="listbox"
                  className={`w-full flex items-center justify-between p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
                    dropdownOpen
                      ? "border-[#c0392b] ring-2 ring-[#c0392b]/20 bg-white shadow-sm"
                      : selectedForm
                      ? "border-[#c0392b]/60 bg-red-50/40"
                      : "border-gray-300 bg-gray-50/70 hover:bg-red-50/30 hover:border-red-200"
                  }`}
                >
                  <div className="min-w-0 pr-3">
                    {selectedForm ? (
                      <>
                        <div className="text-xs font-semibold tracking-wide text-gray-900 truncate">
                          {selectedForm.title}
                        </div>
                        <div className="text-[11px] text-gray-500 mt-0.5">
                          Username:{" "}
                          <span className="font-mono text-[#c0392b] font-medium">
                            {selectedForm.username}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div>
                        <div className="text-xs text-gray-600 font-medium">
                          Select a form from dropdown
                        </div>
                        <div className="text-[11px] text-gray-400 mt-0.5">
                          Click to reveal available options
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {selectedForm && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#c0392b] text-white shadow-xs">
                        Selected
                      </span>
                    )}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                        dropdownOpen ? "rotate-180 text-[#c0392b]" : ""
                      }`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </button>

                {/* Dropdown Options List */}
                {dropdownOpen && (
                  <div
                    role="listbox"
                    className="mt-2 space-y-1.5 p-2 bg-white rounded-lg border border-gray-200 shadow-xl animate-in fade-in duration-150 z-20"
                  >
                    {Object.values(FORMS).map((f) => {
                      const isSelected =
                        (username || "").toLowerCase() === f.username.toLowerCase();
                      return (
                        <button
                          key={f.id}
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => {
                            setUsername(f.username);
                            setError(false);
                            setDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between p-3 rounded-md border text-left transition-all cursor-pointer ${
                            isSelected
                              ? "border-[#c0392b] bg-red-50/80 text-gray-900 shadow-xs"
                              : "border-transparent bg-gray-50/60 hover:bg-red-50/40 hover:border-red-200 text-gray-900"
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
                              <span className="font-mono font-medium">
                                {f.username}
                              </span>
                            </div>
                          </div>
                          <div className="shrink-0 flex items-center">
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
                )}
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
