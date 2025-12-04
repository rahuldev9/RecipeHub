"use client";

import { useEffect } from "react";

export default function UserFromLocalStorage({
  onLoad,
}: {
  onLoad: (user: {
    loggedIn: boolean;
    name: string | null;
    email: string | null;
  }) => void;
}) {
  useEffect(() => {
    const stored = localStorage.getItem("user");

    if (!stored) {
      // No user found
      onLoad({
        loggedIn: false,
        name: null,
        email: null,
      });
      return;
    }

    try {
      const parsed = JSON.parse(stored);

      onLoad({
        loggedIn: true,
        name: parsed.name ?? null,
        email: parsed.email ?? null,
      });
    } catch (err) {
      console.error("Invalid user JSON in localStorage:", err);

      onLoad({
        loggedIn: false,
        name: null,
        email: null,
      });
    }
  }, [onLoad]);

  return null; // This component renders nothing
}
