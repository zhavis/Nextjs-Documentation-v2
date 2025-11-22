"use client";

import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

const VerifyEmail = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const verifyEmail = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await axios.post("/api/users/verifyemail", { token });
      if (response.status === 200) {
        setVerified(true);
        setError("");
        toast.success("Email verified successfully!");
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || "Verification failed.");
      toast.error(err?.response?.data?.error || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md p-10 rounded-3xl shadow-2xl bg-white/80 backdrop-blur-lg border border-white/30 text-center space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Verify Email</h1>

        {error && (
          <div className="text-red-600 bg-red-100 border border-red-400 p-3 rounded-xl">
            {error}
          </div>
        )}

        {!verified && (
          <button
            onClick={verifyEmail}
            disabled={loading}
            className={`w-full flex items-center justify-center gap-3 mt-4 p-4 rounded-xl text-white font-semibold shadow-lg transition-all duration-300
              ${!loading ? "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600" : "bg-gray-400 cursor-not-allowed"}
            `}
          >
            {loading && (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {loading ? "Verifying" : "Click here to verify"}
          </button>
        )}

        {verified && (
          <div className="text-green-600 bg-green-100 border border-green-400 p-3 rounded-xl mt-4">
            <h2 className="font-medium mb-2">Verified Successfully!</h2>
            <Link href="/login" className="text-indigo-600 font-semibold hover:underline">
              Proceed to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
