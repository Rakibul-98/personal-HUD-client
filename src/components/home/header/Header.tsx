"use client";

import { Moon, Search, Sun } from "lucide-react";
import Image from "next/image";
import logo from "../../../assets/HUD_logo.png";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  return (
    <div className="w-[95%] mx-auto">
      <div className="flex justify-between gap-2 items-center h-20">
        <Link href="/" className="">
          <Image src={logo} alt="Logo" width={60} height={60} />
        </Link>
        <div className="bg-gray-100/20 rounded-sm flex items-center w-[300px] md:w-[450px]">
          <input
            className="focus:outline-0 ps-3 px-1 w-full"
            type="text"
            placeholder="Search topic..."
          />
          <button
            className="bg-gray-100/30 py-2 px-2.5 rounded-e-sm cursor-pointer hover:bg-gray-100/20"
            type="button"
          >
            <Search className="p-[2px]" />
          </button>
        </div>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="flex items-center rounded-full bg-gray-100/20 p-1 relative cursor-pointer"
          aria-label={
            isDarkMode ? "Switch to light mode" : "Switch to dark mode"
          }
        >
          <div
            className={`absolute top-1 bottom-1 rounded-full bg-blue-400/90 transition-all duration-300 ${
              isDarkMode ? "left-1 right-1/2" : "left-1/2 right-1"
            }`}
          />

          <Sun className="h-7 w-7 relative z-10 p-1 transition-colors duration-300" />
          <Moon className="h-7 w-7 relative z-10 p-1 transition-colors duration-300" />
        </button>
      </div>
    </div>
  );
}
