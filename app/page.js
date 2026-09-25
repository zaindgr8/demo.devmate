"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getFormById } from "@/lib/forms";
import MortgageForm from "./components/MortgageForm";
import LockScreen from "./components/LockScreen";

function MainPortal() {
  const [mounted, setMounted] = useState(false);
  const [unlockedForm, setUnlockedForm] = useState(null);
  const searchParams = useSearchParams();
  const formParam = searchParams.get("form");

  useEffect(() => {
    setMounted(true);
    // Restore session if available
    try {
      const savedFormId = sessionStorage.getItem("unlocked_form_id");
      if (savedFormId) {
        const form = getFormById(savedFormId);
        if (form) {
          setUnlockedForm(form);
        }
      }
    } catch (e) {
      // Ignore sessionStorage errors in restricted browser modes
    }
  }, []);

  const fixedForm = formParam ? getFormById(formParam) : null;

  function handleUnlock(form) {
    setUnlockedForm(form);
    try {
      sessionStorage.setItem("unlocked_form_id", form.id);
    } catch (e) {}
  }

  function handleLock() {
    setUnlockedForm(null);
    try {
      sessionStorage.removeItem("unlocked_form_id");
    } catch (e) {}
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 relative">
        <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#c0392b] via-[#e74c3c] to-[#c0392b] z-50"></div>
        <div className="w-full max-w-md animate-pulse space-y-8">
          <div className="text-center">
            <div className="h-6 bg-red-100/50 w-32 mx-auto mb-2 rounded"></div>
            <div className="h-0.5 bg-gradient-to-r from-[#c0392b] to-[#e74c3c] w-12 mx-auto rounded-full"></div>
          </div>
          <div className="space-y-6">
            <div>
              <div className="h-4 bg-gray-100 w-16 mb-2 rounded"></div>
              <div className="h-12 bg-gray-100 w-full rounded"></div>
            </div>
            <div>
              <div className="h-4 bg-gray-100 w-24 mb-2 rounded"></div>
              <div className="h-12 bg-gray-100 w-full rounded"></div>
            </div>
          </div>
          <div className="h-12 bg-red-100/40 w-full rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (unlockedForm) {
    return <MortgageForm form={unlockedForm} onLock={handleLock} />;
  }

  return (
    <LockScreen fixedForm={fixedForm} onUnlock={handleUnlock} />
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 relative">
          <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#c0392b] via-[#e74c3c] to-[#c0392b] z-50"></div>
          <div className="w-full max-w-md animate-pulse space-y-8">
            <div className="text-center">
              <div className="h-6 bg-red-100/50 w-32 mx-auto mb-2 rounded"></div>
              <div className="h-0.5 bg-gradient-to-r from-[#c0392b] to-[#e74c3c] w-12 mx-auto rounded-full"></div>
            </div>
          </div>
        </div>
      }
    >
      <MainPortal />
    </Suspense>
  );
}
