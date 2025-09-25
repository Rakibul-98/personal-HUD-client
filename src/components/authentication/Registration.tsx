"use client";

import React, { useEffect, useState } from "react";
import { registerUser } from "../../Redux/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../../Redux/hooks";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Registration() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error, userId } = useAppSelector((state) => state.auth);

  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(registerUser(form));
  };

  useEffect(() => {
    if (userId) {
      setForm({ name: "", email: "", password: "" });
      router.push("/login");
    }
  }, [userId, router]);

  return (
    <div className="relative w-[420px] rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 shadow-2xl border border-gray-700">
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-40 blur-xl" />
      <div className="relative z-10 space-y-6">
        <h2 className="text-xl font-semibold text-white text-center">
          Create Account
        </h2>
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        {userId && (
          <p className="text-green-400 text-sm text-center">
            Registration successful!
          </p>
        )}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
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
          <p className="text-sm text-white text-center">
            Already registered?{" "}
            <Link className="underline hover:no-underline" href="/login">
              Login here
            </Link>
          </p>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 py-2 rounded-lg text-white font-semibold hover:opacity-90 transition"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}
