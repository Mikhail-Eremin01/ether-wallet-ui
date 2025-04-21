'use client';

import { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";
import { DecodedToken } from "@/types/auth";

export function useAuth() {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        setUser({ username: decoded.username });
      } catch {
        console.error("Invalid token");
        localStorage.removeItem("token");
      }
    }

    setIsLoading(false);
  }, []);

  return { user, isLoading };
}