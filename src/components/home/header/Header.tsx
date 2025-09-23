"use client";

import { Moon } from "lucide-react";
import { Toggle } from "../../ui/toggle";

export default function Header() {
  return (
    <div>
      <div className="flex justify-between ">
        <div className="flex gap-2">
          <p>logo</p>
          <p>name</p>
        </div>
        <div>
          <input className="border" type="text" placeholder="Search" />
          <button type="button">Search</button>
        </div>
        <div>
          <Toggle aria-label="Toggle dark mode">
            <Moon className="h-4 w-4 mr-2" />
            Dark Mode
          </Toggle>
        </div>
      </div>
    </div>
  );
}
