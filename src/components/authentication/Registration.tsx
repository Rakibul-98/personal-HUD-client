"use client";

import React, { useState } from "react";
import { registerUser, clearError } from "../../Redux/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../../Redux/hooks";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Registration() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error } = useAppSelector((s) => s.auth);

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(clearError());
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(registerUser(form));
    if (registerUser.fulfilled.match(result)) {
      setSuccess(true);
      setTimeout(() => router.push("/login"), 1500);
    }
  };

  const inputCls = "w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm";

  return (
    <div className="relative w-[420px] rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 shadow-2xl border border-gray-700">
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-40 blur-xl animate-pulse" />
      <div className="relative z-10 space-y-5">
        <h2 className="text-xl font-semibold text-white text-center">Create Account</h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
            <p className="text-red-400 text-sm text-center">{error}</p>
          </div>
        )}
        {success && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg px-3 py-2">
            <p className="text-green-400 text-sm text-center">Account created! Redirecting to login…</p>
          </div>
        )}

        <form className="space-y-3" onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} className={inputCls} required minLength={2} />
          <input type="email" name="email" placeholder="Email address" value={form.email} onChange={handleChange} className={inputCls} required />
          <input type="password" name="password" placeholder="Password (min. 8 characters)" value={form.password} onChange={handleChange} className={inputCls} required minLength={8} />

          <p className="text-sm text-gray-400 text-center pt-1">
            Already have an account?{" "}
            <Link className="text-blue-400 hover:underline" href="/login">Sign in</Link>
          </p>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 py-2.5 rounded-lg text-white font-semibold hover:opacity-90 transition disabled:opacity-60 cursor-pointer"
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
