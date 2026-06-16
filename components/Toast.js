"use client";

import { useStore } from "@/context/StoreContext";

export default function Toast() {
  const { toast } = useStore();
  if (!toast) return null;

  const bg = toast.type === "success" ? "bg-green-600" : toast.type === "error" ? "bg-red-600" : "bg-vino";

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">
      <div className={`${bg} text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3`}>
        {toast.type === "success" && (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
        {toast.type === "error" && (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
        <span className="font-medium">{toast.message}</span>
      </div>
    </div>
  );
}
