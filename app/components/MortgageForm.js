"use client";

import React, { useState, useEffect } from "react";

export default function MortgageForm({ form, onLock }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!form?.chatWidget) return;

    const widgetConfig = form.chatWidget;
    const scriptId = "retell-widget";

    // Clean up any stale elements before inserting
    const existingScript = document.getElementById(scriptId);
    if (existingScript) existingScript.remove();
    const existingRoot = document.getElementById("retell-widget-root");
    if (existingRoot) existingRoot.remove();

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://dashboard.retellai.com/retell-widget-v2.js";
    script.type = "module";
    script.setAttribute("data-public-key", widgetConfig.publicKey);
    script.setAttribute("data-agent-id", widgetConfig.agentId);
    script.setAttribute("data-agent-version", widgetConfig.agentVersion || "0");
    script.setAttribute("data-title", widgetConfig.title || "Chat with Vizz Heights");
    script.setAttribute("data-fab-text", widgetConfig.fabText || "Need help finding a home?");
    script.setAttribute("data-logo-url", widgetConfig.logoUrl || "/devmate-logo.png");
    script.setAttribute("data-bot-name", widgetConfig.botName || "Devmate AI Assistant");
    script.setAttribute("data-color", widgetConfig.themeColor || "#c0392b");
    script.setAttribute("data-theme-color", widgetConfig.themeColor || "#c0392b");
    document.body.appendChild(script);

    // Active Devmate Branding replacer for shadow DOM & widget elements
    function replaceBranding(container) {
      if (!container) return;

      // 1. Replace Retell links with Devmate Solutions
      const retellLinks = container.querySelectorAll(
        "a[href*='retellai.com'], a[href*='retell']"
      );
      retellLinks.forEach((a) => {
        a.href = widgetConfig.brandingUrl || "https://devmatesolutions.com";
        a.textContent = widgetConfig.brandingName || "devmatesolutions.com";
        a.setAttribute("target", "_blank");
        a.setAttribute("rel", "noopener noreferrer");
        a.style.color = "#c0392b";
        a.style.textDecoration = "underline";
      });

      // 2. Replace any text occurrences of "Retell" in powered-by nodes
      const allTextNodes = container.querySelectorAll(
        "[class*='poweredBy'], [class*='PoweredBy'], span, div, p"
      );
      allTextNodes.forEach((node) => {
        if (
          node.childNodes.length === 1 &&
          node.childNodes[0].nodeType === Node.TEXT_NODE
        ) {
          if (node.textContent.includes("Powered by Retell")) {
            node.innerHTML = `Powered by <a href="${widgetConfig.brandingUrl || "https://devmatesolutions.com"}" target="_blank" rel="noopener noreferrer" style="color: #c0392b; text-decoration: underline; font-weight: 500;">${widgetConfig.brandingName || "devmatesolutions.com"}</a>`;
          }
        }
      });

      // 3. Inject styling for brand consistency into container
      if (!container.querySelector("#devmate-widget-styles")) {
        const style = document.createElement("style");
        style.id = "devmate-widget-styles";
        style.textContent = `
          a[href*="devmatesolutions"] {
            color: #c0392b !important;
            text-decoration: underline !important;
            font-weight: 500 !important;
          }
          [class*="poweredBy"] a {
            color: #c0392b !important;
          }
        `;
        container.appendChild(style);
      }
    }

    let intervalId = null;
    let shadowObserver = null;

    function monitorRoot() {
      const root = document.getElementById("retell-widget-root");
      if (!root) return;

      if (root.shadowRoot) {
        replaceBranding(root.shadowRoot);

        if (!shadowObserver) {
          shadowObserver = new MutationObserver(() => {
            replaceBranding(root.shadowRoot);
          });
          shadowObserver.observe(root.shadowRoot, {
            childList: true,
            subtree: true,
            characterData: true,
          });
        }
      }
    }

    intervalId = setInterval(monitorRoot, 200);

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (shadowObserver) shadowObserver.disconnect();

      const activeScript = document.getElementById(scriptId);
      if (activeScript && activeScript.parentNode) {
        activeScript.parentNode.removeChild(activeScript);
      }
      const activeRoot = document.getElementById("retell-widget-root");
      if (activeRoot && activeRoot.parentNode) {
        activeRoot.parentNode.removeChild(activeRoot);
      }
      document.querySelectorAll("[id*='retell'], [class*='retell']").forEach((el) => {
        if (el.tagName !== "SCRIPT") el.remove();
      });
      if (typeof window !== "undefined" && window.__retellWidgetGlobal) {
        try {
          delete window.__retellWidgetGlobal.__RETELL_CHAT_WIDGET_BUNDLE_LOADED__;
        } catch (e) {}
      }
    };
  }, [form?.chatWidget, form?.id]);

  function handleOpenChat() {
    const root = document.getElementById("retell-widget-root");
    if (root) {
      const buttonInShadow = root.shadowRoot ? root.shadowRoot.querySelector("button") : null;
      const buttonInRoot = root.querySelector("button, [role='button'], div[tabindex='0']");
      const targetBtn = buttonInShadow || buttonInRoot;
      if (targetBtn) {
        targetBtn.click();
        return;
      }
    }
    const genericBtn = document.querySelector("#retell-widget-root button, [class*='retell'] button");
    if (genericBtn) {
      genericBtn.click();
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(false);
    const formElement = e.target;
    const name = formElement.name.value;
    const country = formElement.country.value;
    const contact = formElement.contact.value;

    const dataToSend = {
      formId: form.id,
      name,
      country,
      contact,
    };
    console.log(`Sending data for form [${form.id}] to webhook:`, dataToSend);

    try {
      const res = await fetch("/api/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      const result = await res.json();
      console.log("Webhook response status:", res.status);
      console.log("Webhook response:", result);

      if (res.ok && result.success) {
        console.log("✅ Data successfully sent to webhook!");
        setSuccess(true);
        formElement.reset();
      } else {
        console.error(
          "❌ Webhook returned error:",
          result.error || `Status ${res.status}`
        );
        setError(true);
      }
    } catch (err) {
      console.error("❌ Error sending data to webhook:", err);
      setError(true);
    }
    setLoading(false);
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
        position: "relative",
      }}
    >
      {/* Devmate Top Accent Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#c0392b] via-[#e74c3c] to-[#c0392b] z-50"></div>

      {/* Top action bar */}
      {onLock && (
        <div style={{ maxWidth: "448px", width: "100%", margin: "0 auto 8px auto", display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={onLock}
            type="button"
            className="text-xs text-gray-500 hover:text-[#c0392b] transition-colors flex items-center gap-1.5 py-1 px-2.5 rounded hover:bg-red-50/50"
            title="Lock this form"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            Lock Form
          </button>
        </div>
      )}

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
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl font-light text-black mb-2 tracking-wide">
              {form.title}
            </h1>
            <div className="w-12 h-0.5 bg-gradient-to-r from-[#c0392b] to-[#e74c3c] mx-auto rounded-full"></div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-black mb-2"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                required
                placeholder="Enter your name"
                className="w-full px-0 py-3 border-0 border-b border-gray-300 bg-transparent text-black placeholder-gray-400 focus:outline-none focus:border-[#c0392b] transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="contact"
                className="block text-sm font-medium text-black mb-2"
              >
                Phone Number
              </label>
              <div className="flex gap-3">
                <select
                  id="country"
                  name="country"
                  className="px-0 py-3 border-0 border-b border-gray-300 bg-transparent text-black focus:outline-none focus:border-[#c0392b] transition-colors"
                  defaultValue="971"
                >
                  {/* GCC Countries */}
                  <option value="971">🇦🇪 UAE (+971)</option>
                  <option value="966">🇸🇦 Saudi Arabia (+966)</option>
                  <option value="965">🇰🇼 Kuwait (+965)</option>
                  <option value="974">🇶🇦 Qatar (+974)</option>
                  <option value="973">🇧🇭 Bahrain (+973)</option>
                  <option value="968">🇴🇲 Oman (+968)</option>

                  {/* Other Popular Countries */}
                  <option value="1">🇺🇸 USA (+1)</option>
                  <option value="44">🇬🇧 UK (+44)</option>
                  <option value="92">🇵🇰 Pakistan (+92)</option>
                  <option value="91">🇮🇳 India (+91)</option>
                  <option value="86">🇨🇳 China (+86)</option>
                  <option value="81">🇯🇵 Japan (+81)</option>
                  <option value="49">🇩🇪 Germany (+49)</option>
                  <option value="33">🇫🇷 France (+33)</option>
                  <option value="39">🇮🇹 Italy (+39)</option>
                  <option value="34">🇪🇸 Spain (+34)</option>
                  <option value="61">🇦🇺 Australia (+61)</option>
                  <option value="55">🇧🇷 Brazil (+55)</option>
                  <option value="52">🇲🇽 Mexico (+52)</option>
                  <option value="7">🇷🇺 Russia (+7)</option>
                  <option value="82">🇰🇷 South Korea (+82)</option>
                  <option value="31">🇳🇱 Netherlands (+31)</option>
                  <option value="46">🇸🇪 Sweden (+46)</option>
                  <option value="47">🇳🇴 Norway (+47)</option>
                  <option value="45">🇩🇰 Denmark (+45)</option>
                  <option value="41">🇨🇭 Switzerland (+41)</option>
                  <option value="43">🇦🇹 Austria (+43)</option>
                  <option value="32">🇧🇪 Belgium (+32)</option>
                  <option value="353">🇮🇪 Ireland (+353)</option>
                  <option value="351">🇵🇹 Portugal (+351)</option>
                  <option value="30">🇬🇷 Greece (+30)</option>
                  <option value="48">🇵🇱 Poland (+48)</option>
                  <option value="420">🇨🇿 Czech Republic (+420)</option>
                  <option value="36">🇭🇺 Hungary (+36)</option>
                  <option value="40">🇷🇴 Romania (+40)</option>
                  <option value="359">🇧🇬 Bulgaria (+359)</option>
                  <option value="385">🇭🇷 Croatia (+385)</option>
                  <option value="386">🇸🇮 Slovenia (+386)</option>
                  <option value="421">🇸🇰 Slovakia (+421)</option>
                  <option value="370">🇱🇹 Lithuania (+370)</option>
                  <option value="371">🇱🇻 Latvia (+371)</option>
                  <option value="372">🇪🇪 Estonia (+372)</option>
                  <option value="358">🇫🇮 Finland (+358)</option>
                  <option value="354">🇮🇸 Iceland (+354)</option>
                  <option value="356">🇲🇹 Malta (+356)</option>
                  <option value="357">🇨🇾 Cyprus (+357)</option>
                  <option value="352">🇱🇺 Luxembourg (+352)</option>
                  <option value="423">🇱🇮 Liechtenstein (+423)</option>
                  <option value="378">🇸🇲 San Marino (+378)</option>
                  <option value="376">🇦🇩 Andorra (+376)</option>
                  <option value="377">🇲🇨 Monaco (+377)</option>
                </select>
                <input
                  id="contact"
                  type="tel"
                  name="contact"
                  required
                  placeholder="Phone number"
                  className="flex-1 px-0 py-3 border-0 border-b border-gray-300 bg-transparent text-black placeholder-gray-400 focus:outline-none focus:border-[#c0392b] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-[#c0392b] to-[#e74c3c] text-white font-medium hover:from-[#961918] hover:to-[#c0392b] focus:outline-none focus:ring-2 focus:ring-[#c0392b] focus:ring-offset-2 transition-all shadow-[0_4px_16px_rgba(192,57,43,0.3)] hover:shadow-[0_6px_20px_rgba(192,57,43,0.4)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer rounded-lg"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Sending...
              </span>
            ) : (
              "Submit"
            )}
          </button>

          {/* Success/Error Messages */}
          {success && (
            <div className="text-center p-3 bg-emerald-50 border border-emerald-200 rounded-md">
              <p className="text-sm font-medium text-emerald-700">
                ✓ Thank you! We'll contact you soon.
              </p>
            </div>
          )}
          {error && (
            <div className="text-center p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-[#c0392b]">
                ✗ Something went wrong. Please try again.
              </p>
            </div>
          )}

          {/* Direct Chat Option */}
          {form.chatWidget && (
            <div className="pt-2">
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink mx-3 text-[11px] uppercase tracking-wider text-gray-400 font-medium">
                  Or chat live
                </span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>
              <button
                type="button"
                onClick={handleOpenChat}
                className="w-full py-3.5 px-4 border border-[#c0392b]/30 bg-red-50/50 hover:bg-red-50 hover:border-[#c0392b] text-[#c0392b] font-medium rounded-lg text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs hover:shadow-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                {form.chatWidget.title || "Chat with Vizz Heights"}
              </button>
              <div className="mt-1.5 text-center">
                <span className="text-[11px] text-gray-400">
                  Powered by{" "}
                  <a
                    href="https://devmatesolutions.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-[#c0392b] underline transition-colors font-medium"
                  >
                    devmatesolutions.com
                  </a>
                </span>
              </div>
            </div>
          )}
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
