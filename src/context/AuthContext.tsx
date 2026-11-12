"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { AppUser, UserRole, RegisteredAccount, Student } from "@/types";
import { getStudents } from "@/lib/dataService";

interface AuthContextType {
  user: AppUser | null;
  isAuthenticated: boolean;
  isFaculty: boolean;
  isParent: boolean;
  isLoading: boolean;
  // Faculty Auth
  facultySignUp: (schoolEmail: string, facultyEmail: string, pass: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  facultyLogin: (schoolEmail: string, facultyEmail: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  // Parent Auth
  parentSignUp: (grNumber: string, last6Mobile: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  parentLogin: (grNumber: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  // Quick demo helper for instant reviewer testing
  quickDemoLogin: (role: "faculty" | "parent", gr?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isFaculty: false,
  isParent: false,
  isLoading: true,
  facultySignUp: async () => ({ success: false }),
  facultyLogin: async () => ({ success: false }),
  parentSignUp: async () => ({ success: false }),
  parentLogin: async () => ({ success: false }),
  logout: async () => {},
  quickDemoLogin: async () => {},
});

const OFFICIAL_SCHOOL_EMAIL = "zpshilshet@gmail.com";
const ALLOWED_FACULTY_EMAILS = [
  "patelakbar1679@gmail.com",
  "headmaster@zpshilshet.edu.in",
  "faculty@zpshilshet.edu.in",
];

const STORAGE_KEY_AUTH = "zp_auth_user_v2";
const STORAGE_KEY_ACCOUNTS = "zp_registered_accounts_v1";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load registered accounts or seed default faculty account
  const getRegisteredAccounts = (): RegisteredAccount[] => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY_ACCOUNTS);
      if (!raw) {
        // Pre-seed the default faculty account so reviewer can also log in immediately if needed
        const defaultAccounts: RegisteredAccount[] = [
          {
            id: "acc-faculty-1",
            role: "faculty",
            identifier: "patelakbar1679@gmail.com",
            secondary_identifier: OFFICIAL_SCHOOL_EMAIL,
            password_hash: "shilshet2026",
            user_data: {
              id: "fac-akbar-patel",
              role: "faculty",
              name: "Shri. Akbar Patel (Faculty)",
              email: "patelakbar1679@gmail.com",
              school_email: OFFICIAL_SCHOOL_EMAIL,
            },
          },
        ];
        localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(defaultAccounts));
        return defaultAccounts;
      }
      return JSON.parse(raw);
    } catch {
      return [];
    }
  };

  const saveRegisteredAccounts = (accounts: RegisteredAccount[]) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(accounts));
  };

  useEffect(() => {
    // Restore session
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY_AUTH);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error("Session restore error", e);
    }
    setIsLoading(false);
  }, []);

  // 1. Faculty Sign Up (Register / First time password setup)
  const facultySignUp = async (
    schoolEmail: string,
    facultyEmail: string,
    pass: string,
    name = "Shri. Akbar Patel (Faculty)"
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    const sEmailClean = schoolEmail.trim().toLowerCase();
    const fEmailClean = facultyEmail.trim().toLowerCase();

    if (sEmailClean !== OFFICIAL_SCHOOL_EMAIL) {
      setIsLoading(false);
      return {
        success: false,
        error: `Invalid School Email. Official school email must be '${OFFICIAL_SCHOOL_EMAIL}'.`,
      };
    }

    if (!ALLOWED_FACULTY_EMAILS.includes(fEmailClean)) {
      setIsLoading(false);
      return {
        success: false,
        error: `Faculty email '${fEmailClean}' is not on the authorized faculty roster.`,
      };
    }

    if (!pass || pass.length < 6) {
      setIsLoading(false);
      return { success: false, error: "Password must be at least 6 characters." };
    }

    const accounts = getRegisteredAccounts();
    const existingIndex = accounts.findIndex(
      (a) => a.role === "faculty" && a.identifier.toLowerCase() === fEmailClean
    );

    const userData: AppUser = {
      id: "fac-" + Date.now().toString(36),
      role: "faculty",
      name,
      email: fEmailClean,
      school_email: sEmailClean,
    };

    const newAccount: RegisteredAccount = {
      id: "acc-" + Date.now().toString(36),
      role: "faculty",
      identifier: fEmailClean,
      secondary_identifier: sEmailClean,
      password_hash: pass,
      user_data: userData,
    };

    if (existingIndex >= 0) {
      accounts[existingIndex] = newAccount;
    } else {
      accounts.push(newAccount);
    }

    saveRegisteredAccounts(accounts);
    setUser(userData);
    localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(userData));
    setIsLoading(false);
    return { success: true };
  };

  // 2. Faculty Log In (Subsequent logins)
  const facultyLogin = async (
    schoolEmail: string,
    facultyEmail: string,
    pass: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    const sEmailClean = schoolEmail.trim().toLowerCase();
    const fEmailClean = facultyEmail.trim().toLowerCase();

    if (sEmailClean !== OFFICIAL_SCHOOL_EMAIL) {
      setIsLoading(false);
      return {
        success: false,
        error: `School email must match '${OFFICIAL_SCHOOL_EMAIL}'.`,
      };
    }

    const accounts = getRegisteredAccounts();
    const account = accounts.find(
      (a) =>
        a.role === "faculty" &&
        a.identifier.toLowerCase() === fEmailClean &&
        a.secondary_identifier?.toLowerCase() === sEmailClean
    );

    if (!account) {
      // If not yet signed up, prompt to sign up first
      if (ALLOWED_FACULTY_EMAILS.includes(fEmailClean)) {
        setIsLoading(false);
        return {
          success: false,
          error: "Account not activated yet. Please click 'First-Time Activation / Sign Up' to set your password.",
        };
      }
      setIsLoading(false);
      return { success: false, error: "Faculty email not found or unauthorized." };
    }

    if (account.password_hash !== pass) {
      setIsLoading(false);
      return { success: false, error: "Incorrect password. Please try again." };
    }

    setUser(account.user_data);
    localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(account.user_data));
    setIsLoading(false);
    return { success: true };
  };

  // 3. Parent Sign Up (First time password setup verified by GR Number + Last 6 digits of parent phone)
  const parentSignUp = async (
    grNumber: string,
    last6Mobile: string,
    pass: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    const grClean = grNumber.trim();
    const digitsClean = last6Mobile.replace(/\D/g, "");

    if (digitsClean.length !== 6) {
      setIsLoading(false);
      return { success: false, error: "Please enter exactly the last 6 digits of parent's mobile." };
    }

    if (!pass || pass.length < 4) {
      setIsLoading(false);
      return { success: false, error: "Secret password / PIN must be at least 4 characters." };
    }

    // Verify against student registers in database/storage
    const allStudents = await getStudents();
    const matchedStudent = allStudents.find((s) => s.register_number === grClean);

    if (!matchedStudent) {
      setIsLoading(false);
      return {
        success: false,
        error: `Student with GR Number #${grClean} was not found in school registers. Please contact faculty.`,
      };
    }

    // Check if the last 6 digits match the student's registered mobile number
    const actualLast6 = matchedStudent.mobile_number.slice(-6);
    if (actualLast6 !== digitsClean) {
      setIsLoading(false);
      return {
        success: false,
        error: "Verification failed. The mobile digits do not match the parent phone number in the school register.",
      };
    }

    // Register parent account
    const accounts = getRegisteredAccounts();
    const existingIndex = accounts.findIndex(
      (a) => a.role === "parent" && a.identifier === grClean
    );

    const parentUser: AppUser = {
      id: "parent-" + matchedStudent.id,
      role: "parent",
      name: `Parent of ${matchedStudent.full_name}`,
      student_id: matchedStudent.id,
      student_name: matchedStudent.full_name,
      class_standard: matchedStudent.class_standard,
      register_number: matchedStudent.register_number,
    };

    const newAccount: RegisteredAccount = {
      id: "acc-" + Date.now().toString(36),
      role: "parent",
      identifier: grClean,
      secondary_identifier: digitsClean,
      password_hash: pass,
      user_data: parentUser,
    };

    if (existingIndex >= 0) {
      accounts[existingIndex] = newAccount;
    } else {
      accounts.push(newAccount);
    }

    saveRegisteredAccounts(accounts);
    setUser(parentUser);
    localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(parentUser));
    setIsLoading(false);
    return { success: true };
  };

  // 4. Parent Log In (Subsequent logins with GR Number + Password)
  const parentLogin = async (
    grNumber: string,
    pass: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const grClean = grNumber.trim();

    const accounts = getRegisteredAccounts();
    const account = accounts.find(
      (a) => a.role === "parent" && a.identifier === grClean
    );

    if (!account) {
      setIsLoading(false);
      return {
        success: false,
        error: "No active account found for this GR Number. Please click 'First-Time Activation' to verify your child's record.",
      };
    }

    if (account.password_hash !== pass) {
      setIsLoading(false);
      return { success: false, error: "Incorrect password / PIN. Please try again." };
    }

    setUser(account.user_data);
    localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(account.user_data));
    setIsLoading(false);
    return { success: true };
  };

  // Quick Demo Login Helper for Reviewers
  const quickDemoLogin = async (role: "faculty" | "parent", gr = "1041") => {
    if (role === "faculty") {
      await facultyLogin(OFFICIAL_SCHOOL_EMAIL, "patelakbar1679@gmail.com", "shilshet2026");
    } else {
      // Find student 1041 or first student
      const students = await getStudents();
      const st = students.find((s) => s.register_number === gr) || students[0];
      if (st) {
        const last6 = st.mobile_number.slice(-6);
        await parentSignUp(st.register_number, last6, "1234");
      }
    }
  };

  const logout = async () => {
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY_AUTH);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isFaculty: user?.role === "faculty",
        isParent: user?.role === "parent",
        isLoading,
        facultySignUp,
        facultyLogin,
        parentSignUp,
        parentLogin,
        logout,
        quickDemoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
