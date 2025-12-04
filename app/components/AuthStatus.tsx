"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function useAuthStatus() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [name, setName] = useState<string>("User");
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setLoggedIn(!!user);

      setName(user?.user_metadata?.name ?? "User");
      setEmail(user?.email ?? null);
    });
  }, []);

  return { loggedIn, name, email };
}
