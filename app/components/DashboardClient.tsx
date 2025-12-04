"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import PageLoader from "../components/PageLoader";

export default function DashboardClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarReady, setSidebarReady] = useState(false);

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-orange-50 to-white relative">
      {/* SIDEBAR */}
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
          {children}
        </main>
      )}
    </div>
  );
}
