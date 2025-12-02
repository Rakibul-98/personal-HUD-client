"use client";
import Link from "next/link";
import "./not-found.css";
import ParticleBackground from "../components/BackgroundAnimation/ParticleBackground";

export default function NotFound() {
  return (
    <div className="h-screen flex items-center justify-center">
      <ParticleBackground />
      <div className="content">
        <div className="text-9xl font-extrabold">
          <span className="digit digit-4">4</span>
          <span className="digit digit-0">0</span>
          <span className="digit digit-4 digit-last">4</span>
        </div>

        <h1 className="text-center mt-5 text-2xl">PAGE NOT FOUND</h1>
        <div className="flex justify-center mt-10">
          <Link
            href="/"
            className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-2 shadow-lg shadow-blue-500/40 hover:opacity-90 transition text-white rounded-sm capitalize"
          >
            Back to home safely
          </Link>
        </div>
      </div>
    </div>
  );
}
