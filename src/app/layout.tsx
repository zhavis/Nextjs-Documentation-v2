"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { ProgressProvider, useProgress } from "./api/users/progress/ProgressContext";
import { HiOutlineMenu, HiX, HiUser } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

const inter = Inter({ subsets: ["latin"] });

type Page = {
  title: string;
  href?: string;
  children?: Page[];
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const pages: Page[] = [
    { title: "Introduction", href: "/introduction" },
    { title: "Getting Started", href: "/getting-started" },
    {
      title: "Guides",
      children: [
        { title: "Installing", href: "/guides/installing" },
        { title: "Components", href: "/guides/components" },
        { title: "Configuration", href: "/guides/configuration" },
        { title: "Deployment", href: "/guides/deployment" },
      ],
    },
    { title: "FAQ", href: "/faq" },
    { title: "Status", href: "/status" },
    { title: "Roadmap", href: "/roadmap" },
  ];

  useEffect(() => {
    let mounted = true;
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/users/me", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const result = await res.json();
        if (!mounted) return;
        if (result?.data?.email) {
          setLoggedIn(true);
          setUserEmail(result.data.email);
        } else {
          setLoggedIn(false);
          setUserEmail(null);
        }
      } catch (err) {
        if (!mounted) return;
        setLoggedIn(false);
        setUserEmail(null);
      } finally {
        if (!mounted) return;
        setAuthLoading(false);
      }
    };

    checkAuth();
    const handler = () => checkAuth();
    window.addEventListener("authChanged", handler);
    return () => {
      mounted = false;
      window.removeEventListener("authChanged", handler);
    };
  }, []);

  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-gradient-to-br from-slate-100 to-slate-200 text-slate-800 antialiased min-h-screen flex flex-col`}
      >
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
  pathname: string | null;
  pages: Page[];
}) {
  const { loading: progressLoading, progressPercentage } = useProgress();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [guidesOpen, setGuidesOpen] = useState<boolean>(() => pathname?.startsWith("/guides") ?? false);
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
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full"
        />
        <p className="text-sm text-gray-500 mt-4">Loading {progressPercentage || 0}%...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1">
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white/30 backdrop-blur-xl shadow-lg border-b border-white/20">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
            TT
          </div>
          <span className="font-bold text-indigo-700 text-lg">TailwindTutorial</span>
        </motion.div>

        <div className="flex items-center gap-3">
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl hover:bg-white/40 text-indigo-600 transition"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <HiX className="w-6 h-6" /> : <HiOutlineMenu className="w-6 h-6" />}
          </button>

          {/* User */}
          {/** hide user controls if auth disabled (but we don't have authConfig here) */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-10 h-10 rounded-xl bg-white/40 flex items-center justify-center text-indigo-600 shadow hover:bg-white/60 transition"
              aria-label="User menu"
            >
              <HiUser className="w-6 h-6" />
            </button>

            <AnimatePresence>
              {dropdownOpen && loggedIn && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="absolute right-0 mt-2 w-44 bg-white/60 backdrop-blur-xl rounded-xl shadow-lg overflow-hidden"
                >
                  <Link
                    href="/profile"
                    className="px-4 py-2 text-sm hover:bg-white/70 block text-indigo-700"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm text-left hover:bg-white/70 text-indigo-700 w-full"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <aside
        className={`fixed top-0 left-0 z-40 h-full w-72 bg-white/50 backdrop-blur-xl border-r border-slate-200 pt-24 overflow-auto transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <nav className="px-4 py-4">
          <div className="md:hidden flex items-center gap-3 px-3 mb-4">
            {loggedIn && userEmail ? (
              <>
                <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                  {userEmail.charAt(0).toUpperCase()}
                </div>
                <span className="text-indigo-700 font-medium truncate">{userEmail}</span>
              </>
            ) : null}
          </div>

          <input
            type="text"
            placeholder="Search..."
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <ul className="space-y-2 text-md">
            {pages.map((p) => {
              if (p.children && p.children.length > 0) {
                const filteredChildren = p.children.filter((c) =>
                  c.title.toLowerCase().includes(searchTerm.toLowerCase())
                );
                if (searchTerm && filteredChildren.length === 0) return null;

                return (
                  <li key={p.title}>
                    <button
                      onClick={() => setGuidesOpen((s) => !s)}
                      className={`w-full flex justify-between items-center px-3 py-2 rounded-xl hover:bg-slate-100 transition ${
                        pathname?.startsWith("/guides") ? "bg-indigo-100 text-indigo-700 font-semibold" : ""
                      }`}
                      aria-expanded={guidesOpen}
                    >
                      {p.title}
                      <span>{guidesOpen ? "▲" : "▼"}</span>
                    </button>

                    <AnimatePresence>
                      {guidesOpen && (
                        <motion.ul
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="ml-4 mt-2 space-y-1 overflow-hidden"
                        >
                          {filteredChildren.map((child) => (
                            <li key={child.href}>
                              <Link
                                href={child.href || "#"}
                                onClick={() => setMobileOpen(false)}
                                className={`block px-3 py-2 rounded-md hover:bg-slate-100 ${
                                  pathname === child.href ? "bg-indigo-100 text-indigo-700 font-semibold" : ""
                                }`}
                              >
                                {child.title}
                              </Link>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </li>
                );
              }
              if (p.href) {
                if (searchTerm && !p.title.toLowerCase().includes(searchTerm.toLowerCase())) return null;

                return (
                  <li key={p.href}>
                    <Link
                      href={p.href}
                      onClick={() => setMobileOpen(false)}
                      className={`block px-3 py-2 rounded-xl hover:bg-slate-100 transition ${
                        pathname === p.href ? "bg-indigo-100 font-semibold text-indigo-700" : ""
                      }`}
                    >
                      {p.title}
                    </Link>
                  </li>
                );
              }

              return null;
            })}
          </ul>
          {loggedIn && (
            <button
              onClick={handleLogout}
              className="mt-6 w-full px-3 py-2 text-sm text-indigo-700 bg-white/40 rounded-xl hover:bg-white/60 shadow"
            >
              Logout
            </button>
          )}

          <div className="px-4 py-4 border-t border-slate-100 text-xs text-slate-500 flex flex-col gap-2 mt-6">
            <div>
              Version <span className="font-medium text-slate-700">1.0.0</span>
            </div>
            <div>
              <a href="https://github.com/zhavis" className="underline">
                https://github.com/zhavis
              </a>
            </div>
          </div>
        </nav>
      </aside>
      <main className="flex-1 p-6 pt-24 md:ml-72">{children}</main>
    </div>
  );
}

