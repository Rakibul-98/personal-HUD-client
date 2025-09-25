"use client";

import { useAppSelector } from "../../Redux/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, token } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!token || !user) {
      router.push("/login");
    }
  }, [token, user, router]);

  if (!token || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-400">Redirecting to login...</p>
      </div>
    );
  }

  return <>{children}</>;
}
