"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useAuthStatus } from "../../components/AuthStatus";
import PageLoader from "@/app/components/PageLoader";

export default function Login() {
  const { loggedIn, name } = useAuthStatus();
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin(e: any) {
    e.preventDefault();
    setErrorMsg("");

    if (!email.trim()) {
      return setErrorMsg("Email is required.");
    }
    if (!password.trim()) {
      return setErrorMsg("Password is required.");
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) return setErrorMsg(error.message);
    

    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center px-6">
      {loading && <PageLoader text="Authenticating..." />}
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full border border-orange-200 animate-fadeIn"
      >
        <h1 className="text-3xl font-bold text-center text-orange-600">
          Welcome Back
        </h1>
        <p className="text-gray-500 text-center mt-1">Login to RecipeHub 🍽️</p>

        <div className="mt-6 space-y-4">
          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 p-3 w-full rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password */}
          {/* Password Input with Eye Toggle */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="border border-gray-300 p-3 w-full rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Forgot password link */}
          <div className="text-right -mt-2">
            <Link
              href="/auth/reset-password"
              className="text-sm text-orange-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Login button */}
          <button
            disabled={loading}
            className="w-full bg-orange-600 text-white p-3 rounded-xl font-bold text-lg hover:bg-orange-700 transition flex items-center justify-center disabled:opacity-50"
          >
            {loading ? (
              <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Login"
            )}
          </button>
        </div>

        {/* Error message */}
        {errorMsg && (
          <p className="text-center text-red-600 text-sm mt-3">{errorMsg}</p>
        )}

        {/* No account */}
        <p className="text-center text-gray-700 mt-6">
          Don’t have an account?{" "}
          <Link
            href="/auth/signup"
            className="text-orange-600 font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>

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
