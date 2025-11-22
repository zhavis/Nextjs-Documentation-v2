"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { ProgressProvider, useProgress } from "./api/users/progress/ProgressContext";
import { HiOutlineMenu, HiX, HiUser } from "react-icons/hi";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const pages = [
    { title: "Introduction", href: "/introduction" },
    { title: "Getting Started", href: "/getting-started" },
    { title: "Guides", href: "/guides" },
    { title: "FAQ", href: "/faq" },
  ];

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/users/me", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const result = await res.json();
        if (result?.data?.email) {
          setLoggedIn(true);
          setUserEmail(result.data.email);
        } else {
          setLoggedIn(false);
          setUserEmail(null);
        }
      } catch (err) {
        console.error(err);
        setLoggedIn(false);
        setUserEmail(null);
        toast.error("Failed to fetch user info");
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
    const handler = () => checkAuth();
    window.addEventListener("authChanged", handler);
    return () => window.removeEventListener("authChanged", handler);
  }, []);

  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-800 antialiased min-h-screen flex flex-col`}>
        <Toaster />
        <ProgressProvider>
          <LayoutContent
            authLoading={authLoading}
            loggedIn={loggedIn}
            userEmail={userEmail}
            mobileOpen={mobileOpen}
            setMobileOpen={setMobileOpen}
            pathname={pathname}
            pages={pages}
          >
            {children}
          </LayoutContent>
        </ProgressProvider>
      </body>
    </html>
  );
}

function LayoutContent({
  children,
  authLoading,
  loggedIn,
  userEmail,
  mobileOpen,
  setMobileOpen,
  pathname,
  pages,
}: {
  children: React.ReactNode;
  authLoading: boolean;
  loggedIn: boolean;
  userEmail: string | null;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
  pathname: string;
  pages: { title: string; href: string }[];
}) {
  const { loading: progressLoading, progressPercentage } = useProgress();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const isLoading = authLoading || progressLoading;

  const handleLogout = async () => {
    try {
      await axios.get("/api/users/logout", { withCredentials: true });
      window.dispatchEvent(new Event("authChanged"));
      toast.success("Logged out successfully");
      setDropdownOpen(false);
    } catch {
      toast.error("Logout failed");
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin mb-4"></div>
        <p className="text-sm text-gray-500">{`Loading progress ${progressPercentage || 0}%...`}</p>
      </div>
    );
  }
  return (
    <div className="flex flex-1">
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white/20 backdrop-blur-md shadow-md border-b border-white/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
            TT
          </div>
          <span className="font-bold text-indigo-600 text-lg backdrop-blur-sm">TailwindTutorial</span>
        </div>
        <div className="flex items-center gap-3 bg-white/20 backdrop-blur-md rounded-full p-1 shadow-lg">
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/30 text-indigo-600 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <HiX className="w-6 h-6" /> : <HiOutlineMenu className="w-6 h-6" />}
          </button>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-indigo-600 shadow-lg hover:scale-105 hover:bg-white/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <HiUser className="w-6 h-6" />
            </button>

            {dropdownOpen && loggedIn && (
              <div className="absolute right-0 mt-2 w-40 bg-white/20 backdrop-blur-md rounded-lg shadow-lg overflow-hidden flex flex-col z-50">
                <Link
                  href="/profile"
                  className="px-4 py-2 text-sm text-indigo-700 hover:bg-white/30"
                  onClick={() => setDropdownOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm text-indigo-700 text-left hover:bg-white/30"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-72 bg-white border-r border-slate-200 bg-white/20 backdrop-blur-md overflow-auto pt-24 transform transition-transform duration-200 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <nav className="px-2 py-4 flex-1">
          <div className="md:hidden flex items-center gap-3 px-3 mb-4">
            {loggedIn && userEmail && (
              <>
                <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                  {userEmail.charAt(0).toUpperCase()}
                </div>
                <span className="text-indigo-700 font-medium truncate">{userEmail}</span>
              </>
            )}
          </div>
          <div className="px-3 mb-4">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <ul className="space-y-2 text-md">
            {pages
              .filter((p) => p.title.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((p) => (
                <li key={p.href}>
                  <Link
                    href={p.href}
                    className={`block px-3 py-2 rounded-md hover:bg-slate-50 ${
                      pathname === p.href ? "bg-indigo-100 font-medium text-indigo-700" : ""
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
          </ul>

          {loggedIn && (
            <button
              onClick={handleLogout}
              className="mt-4 w-full px-3 py-2 text-sm text-indigo-700 bg-white/20 rounded-md hover:bg-white/30"
            >
              Logout
            </button>
          )}
        </nav>

        <div className="px-4 py-4 border-t border-slate-100 text-xs text-slate-500 flex flex-col gap-2">
          <div>
            Version <span className="font-medium text-slate-700">1.0.0</span>
          </div>
          <div>
            <a href="https://github.com/zhavis">
          https://github.com/zhavis
          </a>
          </div>
        </div>
      </aside>
      <main className="flex-1 p-6 pt-24 md:ml-72">{children}</main>
    </div>
  );
}


