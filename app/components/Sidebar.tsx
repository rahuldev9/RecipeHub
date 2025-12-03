"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStatus } from "./AuthStatus";

import {
  ClipboardCheck,
  TrendingUp,
  Boxes,
  Menu,
  LogOut,
  X,
  PanelRightOpen,
} from "lucide-react";
import LogoutButton from "@/components/ui/LogoutButton";

interface SidebarProps {
  activePage?: string;
  autoClose?: boolean;
  user?: string;
  onToggle?: (isOpen: boolean) => void; // Add this
}

const Sidebar: React.FC<SidebarProps> = ({ autoClose, onToggle, user }) => {
  // Fetch user plan information
  const { loggedIn, name } = useAuthStatus();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [Username, setUsername] = useState("");

  useEffect(() => {
    if (user) {
      setUsername(user);
    }
  }, [user]);

  // Determine auto-close behavior
  const shouldAutoClose = autoClose !== undefined ? autoClose : isMobile;

  const isActive = (paths: string | string[]) => {
    if (Array.isArray(paths)) {
      return paths.some((p) => pathname.startsWith(p));
    }
    return pathname.startsWith(paths);
  };

  const getActivePageInfo = () => {
    switch (true) {
      case pathname.startsWith("/dashboard"):
        return { title: "Dashboard", icon: <Boxes className="w-6 h-6" /> };

      case pathname.startsWith("/getrecipe"):
        return {
          title: "Get Recipe",
          icon: <ClipboardCheck className="w-6 h-6" />,
        };

      default:
        return { title: "RecipeHub", icon: null }; // default icon can be added
    }
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // AUTO-CLOSE ON PAGE NAVIGATION
  useEffect(() => {
    if (shouldAutoClose) {
      setIsOpen(false);
      setProfileDropdownOpen(false);
    }
  }, [pathname, shouldAutoClose]);

  // Close sidebar when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        shouldAutoClose &&
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [shouldAutoClose, isOpen]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobile, isOpen]);

  // Hide scrollbars globally
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .hide-scrollbar::-webkit-scrollbar {
        display: none;
        width: 0px;
        height: 0px;
      }
      .hide-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
        overflow-x: hidden !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const toggleSidebar = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onToggle?.(newState); // Call parent callback
  };

  // Also call it when isOpen changes due to other reasons
  useEffect(() => {
    onToggle?.(isOpen);
  }, [isOpen, onToggle]);

  const handleLinkClick = () => {
    if (shouldAutoClose) {
      setIsOpen(false);
      setProfileDropdownOpen(false);
    }
  };

  return (
    <>
      {/* Mobile sticky header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow flex items-center justify-between px-4 py-3">
        <button
          onClick={toggleSidebar}
          className="p-2 border-none hover:bg-transparent hover:text-black"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        <span className="flex items-center gap-2 text-lg font-semibold text-gray-800">
          {/* {getActivePageInfo().icon} */}
          <Image
            src="/RecipeHublogo.png"
            alt="RecipeHub Logo"
            width={36}
            height={36}
            className="rounded-md"
          />
          {getActivePageInfo().title}
        </span>

        <div className="w-6" />
      </div>

      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-white/10 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className="flex h-screen hide-scrollbar pt-14 md:pt-0">
        {/* Sidebar */}
        <div
          ref={sidebarRef}
          className={`fixed top-0 left-0 z-50 h-screen bg-white shadow-lg flex flex-col transition-all duration-300 ease-in-out hide-scrollbar ${
            isOpen ? "w-64" : isMobile ? "w-0" : "w-20"
          } ${isMobile ? "md:static" : ""}`}
        >
          {/* Header with logo */}
          <div
            className={`p-3 md:p-4 flex items-center flex-shrink-0 ${
              isOpen ? "justify-between" : "justify-center"
            }`}
          >
            {isOpen ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2"
                  onClick={handleLinkClick}
                >
                  <Image
                    src="/RecipeHublogo.png"
                    alt="RecipeHub Logo"
                    width={36}
                    height={36}
                    className="rounded-md"
                  />
                  <span className="text-xl font-bold text-gray-800">
                    RecipeHub
                  </span>
                </Link>
                <button
                  onClick={toggleSidebar}
                  className="text-gray-500 hover:text-gray-700 hover:bg-transparent border-none p-1"
                  aria-label="Close sidebar"
                >
                  <PanelRightOpen className="w-6 h-6" />
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <Link
                  href="/dashboard"
                  className="flex items-center"
                  onClick={handleLinkClick}
                >
                  <Image
                    src="/RecipeHublogo.png"
                    alt="RecipeHub Logo"
                    width={36}
                    height={36}
                    className="rounded-md"
                  />
                </Link>
                {!isMobile && (
                  <button
                    onClick={toggleSidebar}
                    className="text-gray-500 hover:text-gray-700 hover:bg-transparent border-none p-1"
                  >
                    <Menu className="w-6 h-6" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Nav items */}
          <div className="flex-grow flex flex-col hide-scrollbar">
            <nav className="flex-grow px-2 md:px-4 pt-2  overflow-y-auto hide-scrollbar">
              <ul className="space-y-4 md:space-y-4">
                {/* Core Section */}
                <li>
                  <div className="space-y-2">
                    <Link
                      href="/dashboard"
                      onClick={handleLinkClick}
                      className={`flex items-center px-3 py-3 rounded-xl transition-colors ${
                        isActive("/dashboard")
                          ? "text-orange-500 bg-orange-50"
                          : "text-gray-700 hover:bg-gray-50"
                      } ${!isOpen && !isMobile ? "justify-center" : "gap-3"}`}
                      title={!isOpen ? "Dashboard" : ""}
                    >
                      <Boxes className="w-6 h-6 flex-shrink-0" />
                      {isOpen && <span>Dashboard</span>}
                    </Link>
                    <Link
                      href="/getrecipe"
                      className={`flex items-center px-3 py-3 w-full font-normal rounded-xl transition-colors border-none ${
                        isActive("/getrecipe")
                          ? "text-orange-500 bg-orange-50"
                          : "text-gray-700 hover:bg-transparent hover:text-gray-700"
                      } ${!isOpen && !isMobile ? "justify-center" : "gap-3"}`}
                      title={!isOpen ? "Insights" : ""}
                    >
                      <TrendingUp className="w-6 h-6 flex-shrink-0" />
                      {isOpen && <span>GetRecipe</span>}
                    </Link>
                  </div>
                </li>
              </ul>
            </nav>

            {/* Profile section */}
            <div className="p-2 md:p-4 border-t border-gray-200 mt-auto">
              {loggedIn && (
                <div
                  className={`flex ${
                    isOpen
                      ? "items-center justify-between" // Open → avatar + name + logout in one row
                      : "flex-col items-center gap-3" // Closed → avatar on top, logout below
                  }`}
                >
                  {/* Avatar + Name (group together) */}
                  <div
                    className={`flex items-center ${
                      isOpen ? "gap-3" : "flex-col gap-1"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
                      {name.charAt(0).toUpperCase()}
                    </div>

                    {/* Name only shows when sidebar is open */}
                    {isOpen && <p className="font-medium">{name}</p>}
                  </div>

                  {/* Logout button */}
                  <LogoutButton />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Toggle button - only visible on mobile when sidebar is closed */}
        <button
          onClick={toggleSidebar}
          className={`fixed top-4 z-30 border-none shadow-md transition-all duration-300 ease-in-out ${
            isOpen || !isMobile
              ? "opacity-0 invisible"
              : "left-4 opacity-100 visible"
          } md:hidden`}
          aria-label="Toggle sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Main content area */}
        <div
          className={`flex-1 bg-gray-100 min-h-screen transition-all duration-300 ease-in-out ${
            isOpen && !isMobile
              ? "ml-64"
              : !isOpen && !isMobile
              ? "ml-20"
              : "ml-0"
          }`}
        ></div>
      </div>
    </>
  );
};

export default Sidebar;
