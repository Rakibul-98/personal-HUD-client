"use client";

import Image from "next/image";
import logo from "../../../assets/HUD_logo.png";
import Link from "next/link";

export default function Header() {
  return (
    <div className="w-[95%] mx-auto">
      <div className="pt-1">
        <Link href="/" className="inline-block">
          <Image src={logo} alt="Logo" width={50} height={50} />
        </Link>
      </div>
    </div>
  );
}
