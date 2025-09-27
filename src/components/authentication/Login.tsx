"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "../../Redux/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../../Redux/hooks";
import Link from "next/link";
import Image from "next/image";
import google from "../../assets/google.svg";

export default function Login() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error, token } = useAppSelector((state) => state.auth);

  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

  useEffect(() => {
    if (token) {
      router.push("/feed");
    }
  }, [token, router]);

  const handleGoogleSignIn = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  return (
    <div className="relative w-[420px] rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 shadow-2xl border border-gray-700">
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-40 blur-xl animate-pulse" />
      <div className="relative z-10 space-y-6">
        <h2 className="text-xl font-semibold text-white text-center">
          Welcome Back
        </h2>
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <p className="text-sm text-white">
            Don&apos;t have an account?{" "}
            <Link className="underline hover:no-underline" href="/registration">
              Register Now
            </Link>
          </p>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 py-2 rounded-lg text-white font-semibold hover:opacity-90 transition cursor-pointer"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="h-px -mt-2 bg-gradient-to-r from-blue-400/80 via-blue-400/30 to-blue-400/80"></div>
        <div className="flex items-center justify-center -mt-2">
          <button
            onClick={handleGoogleSignIn}
            className="w-full bg-white/15 flex items-center justify-center gap-2 py-2 rounded-lg cursor-pointer hover:bg-white/30 text-white transition"
          >
            <Image src={google} alt="Google" className="w-5 h-5" />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}
