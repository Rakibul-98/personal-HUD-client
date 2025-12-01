"use client";

import { useAppSelector } from "../../Redux/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { HashLoader } from "react-spinners";
import { useTheme } from "../ThemeProvider/ThemeProvider";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, token } = useAppSelector((state) => state.auth);
  const router = useRouter();

  const { isDarkMode } = useTheme();

  useEffect(() => {
    if (!token || !user) {
      router.push("/login");
    }
  }, [token, user, router]);

  if (!token || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <HashLoader color={`${isDarkMode ? "white" : "black"}`} size={50} />
      </div>
    );
  }

  return <>{children}</>;
}
