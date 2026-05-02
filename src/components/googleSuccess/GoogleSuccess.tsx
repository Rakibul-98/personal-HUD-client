"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "../../Redux/hooks";
import { setUserFromGoogle } from "../../Redux/slices/authSlice";

/**
 * This page is reached after Google OAuth completes.
 * The backend now sets the JWT as an httpOnly cookie and redirects here.
 * We no longer extract the token from the URL — it's already in the cookie.
 * We just fetch the user profile to hydrate the Redux store.
 */
export default function GoogleSuccess() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Backend redirects straight to /feed now — this page is a fallback
    // Fetch profile to hydrate Redux state using the cookie that was just set
    import("../../lib/axios").then(({ default: api }) => {
      api.get("/users/profile")
        .then(({ data }) => {
          if (data.data) {
            dispatch(setUserFromGoogle({ user: data.data }));
          }
          router.replace("/feed");
        })
        .catch(() => {
          // Cookie was set but profile fetch failed — still redirect
          router.replace("/feed");
        });
    });
  }, [dispatch, router]);

  return (
    <div className="h-screen flex flex-col justify-center items-center text-center space-y-6">
      <div className="flex items-center justify-center space-x-2 animate-pulse">
        <div className="w-10 h-10 bg-blue-500 rounded-full" />
        <div className="w-10 h-10 bg-red-500 rounded-full" />
        <div className="w-10 h-10 bg-yellow-500 rounded-full" />
        <div className="w-10 h-10 bg-green-500 rounded-full" />
      </div>
      <div>
        <p className="text-xl font-medium">Signing you in with Google…</p>
        <p className="opacity-60 mt-2 text-sm">One moment please</p>
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
