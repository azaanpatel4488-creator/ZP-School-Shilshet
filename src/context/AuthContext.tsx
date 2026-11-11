"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { FacultyUser } from "@/types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface AuthContextType {
  user: FacultyUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  loginDemo: (role?: "headmaster" | "teacher") => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => ({ success: false }),
  logout: async () => {},
  loginDemo: () => {},
});

const DEMO_HEADMASTER: FacultyUser = {
  id: "fac-patil",
  email: "headmaster@zpshilshet.edu.in",
  name: "Shri. Ravindra M. Patil (Headmaster)",
  role: "headmaster",
};

const DEMO_TEACHER: FacultyUser = {
  id: "fac-jadhav",
  email: "teacher@zpshilshet.edu.in",
  name: "Smt. Sunita K. Jadhav (Faculty)",
  role: "teacher",
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FacultyUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local demo session
    const saved = localStorage.getItem("zp_auth_user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved auth", e);
      }
    }

    // If Supabase is configured, also listen to Supabase auth state
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const facultyUser: FacultyUser = {
            id: session.user.id,
            email: session.user.email || "faculty@zpshilshet.edu.in",
            name: session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "Faculty Member",
            role: (session.user.user_metadata?.role as "headmaster" | "teacher") || "teacher",
          };
          setUser(facultyUser);
          localStorage.setItem("zp_auth_user", JSON.stringify(facultyUser));
        }
        setIsLoading(false);
      });

      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const facultyUser: FacultyUser = {
            id: session.user.id,
            email: session.user.email || "faculty@zpshilshet.edu.in",
            name: session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "Faculty Member",
            role: (session.user.user_metadata?.role as "headmaster" | "teacher") || "teacher",
          };
          setUser(facultyUser);
          localStorage.setItem("zp_auth_user", JSON.stringify(facultyUser));
        } else if (!localStorage.getItem("zp_auth_user")) {
          setUser(null);
        }
      });

      return () => {
        authListener?.subscription?.unsubscribe();
      };
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    // Check if matching demo credentials
    if (
      email.toLowerCase() === "headmaster@zpshilshet.edu.in" ||
      email.toLowerCase() === "admin@zpshilshet.edu.in"
    ) {
      setUser(DEMO_HEADMASTER);
      localStorage.setItem("zp_auth_user", JSON.stringify(DEMO_HEADMASTER));
      setIsLoading(false);
      return { success: true };
    }

    if (
      email.toLowerCase() === "teacher@zpshilshet.edu.in" ||
      email.toLowerCase() === "faculty@zpshilshet.edu.in"
    ) {
      setUser(DEMO_TEACHER);
      localStorage.setItem("zp_auth_user", JSON.stringify(DEMO_TEACHER));
      setIsLoading(false);
      return { success: true };
    }

    // If Supabase configured, attempt real auth
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: pass,
        });

        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }

        if (data.user) {
          const facultyUser: FacultyUser = {
            id: data.user.id,
            email: data.user.email || email,
            name: data.user.user_metadata?.full_name || email.split("@")[0],
            role: (data.user.user_metadata?.role as "headmaster" | "teacher") || "teacher",
          };
          setUser(facultyUser);
          localStorage.setItem("zp_auth_user", JSON.stringify(facultyUser));
          setIsLoading(false);
          return { success: true };
        }
      } catch (err: any) {
        setIsLoading(false);
        return { success: false, error: err.message || "Authentication failed" };
      }
    }

    // Default fallback: allow login with any valid formatted email for quick testing
    if (email && pass && pass.length >= 6) {
      const genericUser: FacultyUser = {
        id: "fac-" + Date.now().toString(36),
        email,
        name: email.split("@")[0].toUpperCase() + " (Faculty)",
        role: "teacher",
      };
      setUser(genericUser);
      localStorage.setItem("zp_auth_user", JSON.stringify(genericUser));
      setIsLoading(false);
      return { success: true };
    }

    setIsLoading(false);
    return { success: false, error: "Invalid credentials. Password must be at least 6 characters." };
  };

  const loginDemo = (role: "headmaster" | "teacher" = "headmaster") => {
    const selected = role === "headmaster" ? DEMO_HEADMASTER : DEMO_TEACHER;
    setUser(selected);
    localStorage.setItem("zp_auth_user", JSON.stringify(selected));
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn("Supabase signout failed:", e);
      }
    }
    setUser(null);
    localStorage.removeItem("zp_auth_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        loginDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
