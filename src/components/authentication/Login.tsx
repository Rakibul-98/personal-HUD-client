"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginUser, clearError } from "../../Redux/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../../Redux/hooks";
import Link from "next/link";
import Image from "next/image";
import google from "../../assets/google.svg";

export default function Login() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error, token } = useAppSelector((s) => s.auth);
  const [form, setForm] = useState({ email: "", password: "" });

  useEffect(() => {
    if (token) router.push("/feed");
  }, [token, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(clearError());
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

  const handleGoogleSignIn = () => {
    // Redirect to backend Google OAuth — cookie will be set server-side
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}/api/auth/google`;
  };

  const inputCls = "w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm";

  return (
    <div className="relative w-[420px] rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 shadow-2xl border border-gray-700">
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-40 blur-xl animate-pulse" />
      <div className="relative z-10 space-y-5">
        <h2 className="text-xl font-semibold text-white text-center">Welcome Back</h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
            <p className="text-red-400 text-sm text-center">{error}</p>
          </div>
        )}

        <form className="space-y-3" onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Email address" value={form.email} onChange={handleChange} className={inputCls} required autoComplete="email" />
          <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} className={inputCls} required autoComplete="current-password" />

          <p className="text-sm text-gray-400 text-center pt-1">
            Don&apos;t have an account?{" "}
            <Link className="text-blue-400 hover:underline" href="/registration">Register</Link>
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 py-2.5 rounded-lg text-white font-semibold hover:opacity-90 transition disabled:opacity-60 cursor-pointer"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <div className="relative flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-700" />
          <span className="text-xs text-gray-500">or</span>
          <div className="flex-1 h-px bg-gray-700" />
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-white/10 flex items-center justify-center gap-2 py-2.5 rounded-lg cursor-pointer hover:bg-white/20 text-white text-sm transition"
        >
          <Image src={google} alt="Google" className="w-4 h-4" />
          Continue with Google
        </button>
      </div>
    </div>
  );
}
