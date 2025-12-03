"use client";

import { createClient } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const supabase = createClient();

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/auth/login";
  }

  return (
    <button
      onClick={logout}
      className=" text-red-500 p-2 rounded-xl cursor-pointer"
    >
      <LogOut />
    </button>
  );
}
