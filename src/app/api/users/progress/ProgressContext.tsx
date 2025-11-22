"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

export type ProgressContextType = {
  progressPages: string[];
  markPageAsRead: (page: string) => void;
  loading: boolean; // <-- expose loading
  progressPercentage: number; // <-- optionally expose percentage
};

const ProgressContext = createContext<ProgressContextType>({
  progressPages: [],
  markPageAsRead: () => {},
  loading: true,
  progressPercentage: 0,
});

export const ProgressProvider = ({ children }: { children: React.ReactNode }) => {
  const [progressPages, setProgressPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/users/progress")
      .then((res) => {
        if (Array.isArray(res.data.pages)) {
          setProgressPages(res.data.pages);
        }
      })
      .catch((err) => console.error("Failed to fetch progress:", err))
      .finally(() => setLoading(false));
  }, []);

  const markPageAsRead = async (page: string) => {
    try {
      await axios.post("/api/users/progress", { page });
      setProgressPages((prev) => (prev.includes(page) ? prev : [...prev, page]));
    } catch (err) {
      console.error("Failed to save progress:", err);
    }
  };

  const TOTAL_PAGES = ["introduction", "getting-started", "guides", "faq"];
  const progressPercentage = Math.round((progressPages.length / TOTAL_PAGES.length) * 100);

  return (
    <ProgressContext.Provider value={{ progressPages, markPageAsRead, loading, progressPercentage }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => useContext(ProgressContext);
