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
    <div className="">
      <p>Signing you in with Google...</p>
    </div>
  );
}
