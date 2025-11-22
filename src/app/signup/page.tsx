"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";

const SignUp = () => {
  const router = useRouter();

  const [user, setUser] = useState({ email: "", password: "", username: "" });
  const [isValidData, setIsValidData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSignUp = async () => {
    if (!isValidData) return;
    setLoading(true);
    try {
      await axios.post("/api/users/signup", user);
      toast.success("Account created successfully!");
      router.push("/login");
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Sign up failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsValidData(
      user.email.length > 0 && user.password.length > 0 && user.username.length > 0
    );
  }, [user]);

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md p-10 rounded-3xl shadow-2xl bg-white/80 backdrop-blur-lg border border-white/30">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Create Account</h1>

        <div className="space-y-6">
          <input
            type="text"
            placeholder="Username"
            value={user.username}
            onChange={(e) => setUser((prev) => ({ ...prev, username: e.target.value }))}
            className="w-full p-4 rounded-xl bg-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white text-gray-900 font-medium transition"
          />
          <input
            type="email"
            placeholder="Email"
            value={user.email}
            onChange={(e) => setUser((prev) => ({ ...prev, email: e.target.value }))}
            className="w-full p-4 rounded-xl bg-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white text-gray-900 font-medium transition"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={user.password}
              onChange={(e) => setUser((prev) => ({ ...prev, password: e.target.value }))}
              className="w-full p-4 rounded-xl bg-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white text-gray-900 font-medium transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-4 flex items-center text-gray-500 font-medium"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <button
          onClick={onSignUp}
          disabled={!isValidData || loading}
          className={`w-full flex items-center justify-center gap-3 mt-8 p-4 rounded-xl text-white font-semibold shadow-lg transition-all duration-300
            ${isValidData && !loading
              ? "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
              : "bg-gray-400 cursor-not-allowed"
            }`}
        >
          {loading && (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          )}
          {loading ? "Signing Up..." : "Sign Up"}
        </button>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-600 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
