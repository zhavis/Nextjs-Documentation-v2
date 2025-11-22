"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface UserData {
  _id: string;
  username: string;
  email: string;
  isAdmin?: boolean;
  progress: string[];
}

const pagesList = ["introduction", "getting-started", "guides", "faq"];

const ProfilePage = () => {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const fetchUser = async () => {
    try {
      const res = await axios.get("/api/users/me", { withCredentials: true });
      if (res.data?.data) {
        setUser(res.data.data);
        setUsername(res.data.data.username);
        setEmail(res.data.data.email);
      } else {
        toast.error(res.data?.message || "No user data");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Failed to fetch user");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      const res = await axios.put(
        "/api/users/me",
        { username, email },
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );
      if (res.data?.data) {
        setUser(res.data.data);
        toast.success("Profile updated!");
      } else {
        toast.error(res.data?.message || "Update failed");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Update failed");
    }
  };

  const logout = async () => {
    try {
      await axios.get("/api/users/logout", { withCredentials: true });
      toast.success("Logged out!");
      router.push("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Logout failed");
    }
  };

  const markPageAsRead = async (page: string) => {
    try {
      await axios.post("/api/users/progress", { page }, { withCredentials: true });
      setUser((prev) => prev && { ...prev, progress: [...prev.progress, page] });
      toast.success(`${page.replace("-", " ")} marked as completed`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Failed to mark page");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!user) return <p className="text-center mt-10 text-red-500">No user data</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-xl p-6 space-y-6 bg-white rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-gray-800">Welcome, {user.username}!</h1>
        <p className="text-gray-600 mb-4">Track your progress and update your profile below.</p>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <button
            onClick={updateProfile}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded"
          >
            Save Changes
          </button>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-3">Your Progress</h2>
          <ul className="space-y-2">
            {pagesList.map((page) => {
              const completed = user.progress.includes(page);
              return (
                <li
                  key={page}
                  className={`flex items-center justify-between p-3 rounded-md ${completed ? "bg-green-100" : "bg-gray-100"}`}
                >
                  <span className="capitalize">{page.replace("-", " ")}</span>
                  <span className={`font-semibold ${completed ? "text-green-700" : "text-gray-500"}`}>
                    {completed ? "Completed" : "Pending"}
                  </span>
                  {!completed && (
                    <button
                      onClick={() => markPageAsRead(page)}
                      className="ml-4 bg-indigo-500 hover:bg-indigo-600 text-white text-sm px-2 py-1 rounded"
                    >
                      Mark as Read
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <button
          onClick={logout}
          className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
