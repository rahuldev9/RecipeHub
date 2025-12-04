"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import PageLoader from "../components/PageLoader";
import LogoutButton from "@/components/ui/LogoutButton";
import { useAuthStatus } from "../components/AuthStatus";

export default function ProfilePage() {
  const { loggedIn, name, email } = useAuthStatus();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarReady, setSidebarReady] = useState(false); // <-- NEW
  const [user] = useState({
    name: "John Doe",
    email: "john@example.com",
    avatar: "/avatar.jpg",
  });

  const handleLogout = () => {
    alert("Logged out!");
  };

  return (
    <div className="flex relative">
      <Sidebar
        onToggle={(open, mobile) => {
          setSidebarOpen(open);
          setIsMobile(mobile);

          if (!sidebarReady) setSidebarReady(true); // <-- MARK READY
        }}
      />
      {!sidebarReady && <PageLoader />}
      {sidebarReady && (
        <div
          className="
            flex-grow bg-white px-4 py-10 flex flex-col items-center 
            transition-all duration-300 pt-24 md:pt-20
          "
          style={{
            marginLeft: isMobile ? 0 : sidebarOpen ? 256 : 80,
          }}
        >
          <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
            {/* Avatar */}
            <div className="flex justify-center mb-4">
              <div
                className="w-28 h-28 rounded-full bg-orange-500 text-white 
               flex items-center justify-center text-5xl 
               border-4 border-gray-200 shadow font-bold"
              >
                {name.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* Name */}
            <h1 className="text-2xl font-bold">{name}</h1>

            {/* Email */}
            <p className="text-gray-600 mt-1">{email}</p>

            {/* Divider */}
            <div className="my-6 h-px bg-gray-200"></div>

            {/* Buttons */}
            <div className="flex flex-col gap-3">
              <button
                className="w-full py-3  text-white rounded-xl text-lg font-medium hover:bg-red-600 transition"
                onClick={handleLogout}
              >
                <LogoutButton />
              </button>

              <button className="w-full py-3 bg-gray-100 rounded-xl font-medium hover:bg-gray-200 transition">
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
