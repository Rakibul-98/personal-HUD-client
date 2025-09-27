"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GoogleSuccess() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const userStr = params.get("user");
    if (token && userStr) {
      const user = JSON.parse(decodeURIComponent(userStr));
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      router.push("/feed");
    } else {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="text-center h-screen items-center justify-center">
      <p>Signing you in with Google...</p>
    </div>
  );
}
