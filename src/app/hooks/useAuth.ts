'use client';

import { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";

export function useAuth() {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Добавляем состояние загрузки

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUser({ username: decoded.username });
      } catch (err) {
        console.error("Invalid token");
        localStorage.removeItem("token");
      }
    }

    setIsLoading(false); // Завершаем загрузку
  }, []);

  return { user, isLoading }; // Возвращаем пользователя и состояние загрузки
}