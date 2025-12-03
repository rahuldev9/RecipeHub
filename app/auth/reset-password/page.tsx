"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ResetPassword() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReset(e: any) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Check your email for the reset link.");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-white px-6">
      <form
        onSubmit={handleReset}
        className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full border border-orange-200 animate-fadeIn"
      >
        <h1 className="text-3xl font-bold text-center text-orange-600">
          Reset Password
        </h1>
        <p className="text-gray-500 text-center mt-1">
          We'll send you a reset link
        </p>

        <div className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            className="border border-gray-300 p-3 w-full rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            disabled={loading}
            className="w-full bg-orange-600 text-white p-3 rounded-xl font-bold text-lg hover:bg-orange-700 transition flex items-center justify-center disabled:opacity-50"
          >
            {loading ? (
              <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-3">{message}</p>

        <style>
          {`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animate-fadeIn {
              animation: fadeIn 0.6s ease-out forwards;
            }
          `}
        </style>
      </form>
    </div>
  );
}
