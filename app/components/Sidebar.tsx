"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import UserFromLocalStorage from "./UserFromLocalStorage";

import { Boxes, TrendingUp, Camera, PanelRightOpen, Menu } from "lucide-react";
import LogoutButton from "@/components/ui/LogoutButton";
import PageLoader from "./PageLoader";

interface SidebarProps {
  onToggle?: (isOpen: boolean, isMobile: boolean) => void;
}

export default function Sidebar({ onToggle }: SidebarProps) {
  // const { loggedIn, name } = useAuthStatus();
  const pathname = usePathname();
  const [auth, setAuth] = useState<{
    loggedIn: boolean;
    name: string | null;
    email: string | null;
  }>({
    loggedIn: false,
    name: null,
    email: null,
  });

  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const isActive = (path: string) => pathname.startsWith(path);

  /** ---------- Check screen size ---------- */
  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      const newOpenState = !mobile; // desktop open, mobile closed
      setIsOpen(newOpenState);

      // Pass both states to parent
      onToggle?.(newOpenState, mobile);
    };

    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /** ---------- Sync sidebar state to parent ---------- */
  useEffect(() => {
    onToggle?.(isOpen, isMobile);
  }, [isOpen, isMobile]);

  const handleUserLoaded = useCallback((u: any) => {
    console.log("Loaded auth data:", u);
    setAuth(u);
  }, []);

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      {!auth && <PageLoader />}
      <UserFromLocalStorage onLoad={handleUserLoaded} />
      <div
        className={`hidden md:flex fixed top-0 left-0 h-screen bg-white shadow-lg flex-col
          transition-all duration-300 z-50
          ${isOpen ? "w-64" : "w-20"}`}
      >
        {/* Header */}

        <div className="p-6">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Image
                src="/RecipeHublogo.png"
                alt="RecipeHub Logo"
                width={36}
                height={36}
                className="rounded-md"
              />
              {isOpen && (
                <span className="text-xl font-bold text-gray-800">
                  RecipeHub
                </span>
              )}
            </Link>

            {/* Only show button on the right when open */}
            {isOpen && (
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <PanelRightOpen className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* When closed, show button under the logo */}
          {!isOpen && (
            <div className="mt-2 flex justify-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-grow px-4 space-y-3 mt-3">
          <Link
            href="/dashboard"
            className={`flex items-center px-3 py-3 rounded-xl transition-colors
              ${
                isActive("/dashboard")
                  ? "text-orange-500 bg-orange-50"
                  : "text-gray-700 hover:bg-gray-50"
              }
              ${!isOpen ? "justify-center" : "gap-3"}`}
          >
            <Boxes className="w-6 h-6" />
            {isOpen && <span>Dashboard</span>}
          </Link>

          <Link
            href="/getrecipe"
            className={`flex items-center px-3 py-3 rounded-xl transition-colors
              ${
                isActive("/getrecipe")
                  ? "text-orange-500 bg-orange-50"
                  : "text-gray-700 hover:bg-gray-50"
              }
              ${!isOpen ? "justify-center" : "gap-3"}`}
          >
            <TrendingUp className="w-6 h-6" />
            {isOpen && <span>Get Recipe</span>}
          </Link>

          <Link
            href="/image-response"
            className={`flex items-center px-3 py-3 rounded-xl transition-colors
              ${
                isActive("/image-response")
                  ? "text-orange-500 bg-orange-50"
                  : "text-gray-700 hover:bg-gray-50"
              }
              ${!isOpen ? "justify-center" : "gap-3"}`}
          >
            <Camera className="w-6 h-6" />
            {isOpen && <span>Image Response</span>}
          </Link>
        </nav>

        {/* Profile */}
        <div className="p-4 border-t border-gray-200 mt-auto">
          {
            <div
              className={`flex ${
                isOpen
                  ? "items-center justify-between"
                  : "flex-col items-center gap-3"
              }`}
            >
              <div
                className={`flex items-center ${
                  isOpen ? "gap-3" : "flex-col gap-1"
                }`}
              >
                <div
                  onClick={() => redirect("/profile")}
                  className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold cursor-pointer"
                >
                  {auth?.name ? auth.name.charAt(0).toUpperCase() : "U"}
                </div>

                {isOpen && <p className="font-medium">{auth.name}</p>}
              </div>

              <LogoutButton />
            </div>
          }
        </div>
      </div>

      {/* MOBILE NAV */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50">
        <div className="flex justify-around items-center py-3">
          <Link href="/dashboard">
            <Boxes
              className={`w-7 h-7 ${
                isActive("/dashboard") ? "text-orange-500" : "text-gray-700"
              }`}
            />
          </Link>

          <Link href="/getrecipe">
            <TrendingUp
              className={`w-7 h-7 ${
                isActive("/getrecipe") ? "text-orange-500" : "text-gray-700"
              }`}
            />
          </Link>

          <Link href="/image-response">
            <Camera
              className={`w-7 h-7 ${
                isActive("/image-response")
                  ? "text-orange-500"
                  : "text-gray-700"
              }`}
            />
          </Link>
          <div
            className={`flex ${
              isOpen
                ? "items-center justify-between"
                : "flex-col items-center gap-3"
            }`}
          >
            <div
              className={`flex items-center ${
                isOpen ? "gap-3" : "flex-col gap-1"
              }`}
            >
              <div
                onClick={() => redirect("/profile")}
                className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold cursor-pointer"
              >
                {auth?.name ? auth.name.charAt(0).toUpperCase() : "U"}
              </div>
              {isOpen && <p className="font-medium">{auth.name}</p>}
            </div>
          </div>

          {/* <LogoutButton /> */}
        </div>
      </div>
    </>
  );
}
