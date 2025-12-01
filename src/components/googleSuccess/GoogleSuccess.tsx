"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "../../Redux/hooks";
import { setUserFromGoogle } from "../../Redux/slices/authSlice";

export default function GoogleSuccess() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const userStr = searchParams.get("user");

    if (token && userStr) {
      const user = JSON.parse(decodeURIComponent(userStr));

      dispatch(setUserFromGoogle({ token, user }));

      router.replace("/feed");
    } else {
      router.replace("/login");
    }
  }, [dispatch, router, searchParams]);

  return (
    <div className="h-screen flex flex-col justify-center text-center space-y-6">
      <div className="flex items-center justify-center space-x-2 animate-pulse">
        <div className="w-10 h-10 bg-blue-500 rounded-full"></div>
        <div className="w-10 h-10 bg-red-500 rounded-full"></div>
        <div className="w-10 h-10 bg-yellow-500 rounded-full"></div>
        <div className="w-10 h-10 bg-green-500 rounded-full"></div>
      </div>

      <div>
        <p className="text-xl font-medium">Securely Signing in with Google</p>
        <p className="opacity-60 mt-2 text-sm">One moment please...</p>
      </div>

      <div className="flex justify-center space-x-2">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-3 h-3 bg-blue-600 rounded-full animate-ping"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}
