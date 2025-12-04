"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function useAuthStatus() {
  const supabase = createClient();

  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [name, setName] = useState<string>("User");
  const [email, setEmail] = useState<string | null>(null);

  // Load cached data instantly
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setLoggedIn(true);
        setName(parsed.name || "User");
        setEmail(parsed.email || null);
      } catch {
        console.error("Invalid user JSON in localStorage");
      }
    }
  }, []);

  // Sync with supabase and listen for changes
  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const userData = {
          name: user.user_metadata?.name ?? "User",
          email: user.email ?? null,
        };

        setLoggedIn(true);
        setName(userData.name);
        setEmail(userData.email);

        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        setLoggedIn(false);
        setName("User");
        setEmail(null);
        localStorage.removeItem("user");
      }
    }

    loadUser();

    // 🔥 Listen for login/logout/signup/etc
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          const user = session.user;
          const userData = {
            name: user.user_metadata?.name ?? "User",
            email: user.email ?? null,
          };

          setLoggedIn(true);
          setName(userData.name);
          setEmail(userData.email);

          localStorage.setItem("user", JSON.stringify(userData));
        } else {
          setLoggedIn(false);
          setName("User");
          setEmail(null);
          localStorage.removeItem("user");
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return { loggedIn, name, email };
}
