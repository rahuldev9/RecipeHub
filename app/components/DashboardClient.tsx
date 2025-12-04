"use client";

import { useState, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import PageLoader from "../components/PageLoader";
import UserFromLocalStorage from "./UserFromLocalStorage";

export default function DashboardClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [auth, setAuth] = useState<{
    loggedIn: boolean;
    name: string | null;
    email: string | null;
  }>({
    loggedIn: false,
    name: null,
    email: null,
  });

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarReady, setSidebarReady] = useState(false);
  const handleUserLoaded = useCallback((u: any) => {
    setAuth(u);
  }, []);
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-orange-50 to-white relative">
      {/* SIDEBAR */}
      <UserFromLocalStorage onLoad={handleUserLoaded} />
      <Sidebar
        onToggle={(open, mobile) => {
          setSidebarOpen(open);
          setIsMobile(mobile);
          if (!sidebarReady) setSidebarReady(true);
        }}
      />

      {/* PAGE LOADER */}
      {!sidebarReady && <PageLoader />}
      

      {/* MAIN CONTENT */}
      {sidebarReady && (
        <main
          className="
            flex-1
            transition-all duration-300
            pt-24 sm:pt-16
            px-4
          "
          style={{
            marginLeft: isMobile ? 0 : sidebarOpen ? 256 : 80,
          }}
        >
          <div className="bg-white p-10 rounded-2xl shadow-xl border border-orange-200 animate-fadeIn max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-orange-600">
              Welcome, {auth.name} 👋
            </h1>
            <p className="text-gray-600 mt-2">
              Here is your personalized RecipeHub dashboard.
            </p>
          </div>
          {children}
        </main>
      )}
    </div>
  );
}
