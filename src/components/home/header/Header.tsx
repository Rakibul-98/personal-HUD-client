"use client";

import { Search } from "lucide-react";
import Image from "next/image";
import logo from "../../../assets/HUD_logo.png";
import Link from "next/link";

export default function Header() {
  return (
    <div className="w-[95%] mx-auto">
      <div className="flex gap-2 items-center h-20">
        <Link href="/" className="">
          <Image src={logo} alt="Logo" width={60} height={60} />
        </Link>
        <div className="w-full flex justify-center">
          <div className="bg-gray-100/20 rounded-sm flex items-center w-[300px] md:w-[450px] me-16">
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
        </div>
      </div>
    </div>
  );
}
