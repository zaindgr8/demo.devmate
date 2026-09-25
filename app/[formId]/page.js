"use client";

import React, { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import { getFormById } from "@/lib/forms";
import MortgageForm from "../components/MortgageForm";
import LockScreen from "../components/LockScreen";

export default function ClientFormPage() {
  const params = useParams();
  const formId = params?.formId;
  const form = getFormById(formId);

  const [mounted, setMounted] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (form) {
      try {
        const saved = sessionStorage.getItem(`unlocked_form_${form.id}`);
        if (saved === "true") {
          setUnlocked(true);
        }
      } catch (e) {}
    }
  }, [form]);

  if (!form) {
    notFound();
  }

  function handleUnlock() {
    setUnlocked(true);
    try {
      sessionStorage.setItem(`unlocked_form_${form.id}`, "true");
    } catch (e) {}
  }

  function handleLock() {
    setUnlocked(false);
    try {
      sessionStorage.removeItem(`unlocked_form_${form.id}`);
    } catch (e) {}
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 relative">
        <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#c0392b] via-[#e74c3c] to-[#c0392b] z-50"></div>
        <div className="w-full max-w-md animate-pulse space-y-8">
          <div className="text-center">
            <div className="h-6 bg-red-100/50 w-32 mx-auto mb-2 rounded"></div>
            <div className="h-0.5 bg-gradient-to-r from-[#c0392b] to-[#e74c3c] w-12 mx-auto rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (unlocked) {
    return <MortgageForm form={form} onLock={handleLock} />;
  }

  return <LockScreen fixedForm={form} onUnlock={handleUnlock} />;
}
