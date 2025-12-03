"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function UpdatePassword() {
  const supabase = createClient();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleUpdate(e: any) {
    e.preventDefault();
    setMessage("");

    // Validation
    if (!password) return setMessage("Password is required.");
    if (password.length < 8)
      return setMessage("Password must be at least 8 characters.");
    if (password !== confirmPassword)
      return setMessage("Passwords do not match.");

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (error) return setMessage(error.message);

    setMessage("Password updated! Redirecting...");
    setTimeout(() => router.push("/auth/login"), 1500);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-white px-6">
      <form
        onSubmit={handleUpdate}
        className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full border border-orange-200 animate-fadeIn"
      >
        <h1 className="text-3xl font-bold text-center text-orange-600">
          Set New Password
        </h1>
        <p className="text-gray-500 text-center mt-1">
          Enter and confirm your new password
        </p>

        {/* Password */}
        <div className="relative mt-6">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            className="border border-gray-300 p-3 w-full rounded-xl focus:ring-2 focus:ring-orange-500 outline-none pr-12"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Eye toggle */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="relative mt-4">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm Password"
            className="border border-gray-300 p-3 w-full rounded-xl focus:ring-2 focus:ring-orange-500 outline-none pr-12"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {/* Eye toggle */}
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Update button */}
        <button
          disabled={loading}
          className="w-full mt-6 bg-orange-600 text-white p-3 rounded-xl font-bold text-lg hover:bg-orange-700 transition flex items-center justify-center disabled:opacity-50"
        >
          {loading ? (
            <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Update Password"
          )}
        </button>

        {/* Message */}
        <p className="text-center text-sm text-gray-600 mt-3">{message}</p>

        {/* Fade-in animation */}
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
