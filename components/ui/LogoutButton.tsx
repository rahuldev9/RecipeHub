"use client";
import PageLoader from "@/app/components/PageLoader";
import { createClient } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";
import { useState } from "react";

export default function LogoutButton() {
  const supabase = createClient();
  const [Loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    // 1️⃣ Clear Supabase session
    await supabase.auth.signOut();

    // 2️⃣ Clear locally stored user
    localStorage.removeItem("user");

    // 3️⃣ Redirect
    window.location.href = "/auth/login";
  }

  return (
    <>
      {Loading && <PageLoader text="Please wait..." />}
      <button
        onClick={logout}
        className="text-red-500 p-2 rounded-xl cursor-pointer"
      >
        <LogOut />
      </button>
    </>
  );
}
