"use client";

import { createClient } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const supabase = createClient();

  async function logout() {
    // 1️⃣ Clear Supabase session
    await supabase.auth.signOut();

    // 2️⃣ Clear locally stored user
    localStorage.removeItem("user");

    // 3️⃣ Redirect
    window.location.href = "/auth/login";
  }

  return (
    <button
      onClick={logout}
      className="text-red-500 p-2 rounded-xl cursor-pointer"
    >
      <LogOut />
    </button>
  );
}
