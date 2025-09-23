"use client";

import { Moon } from "lucide-react";
import { Switch } from "../../ui/switch";

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
        <div className="flex items-center space-x-2">
          <Switch id="dark-mode" />
          <Moon className="h-4 w-4" />
          <label htmlFor="dark-mode">Dark Mode</label>
        </div>
      </div>
    </div>
  );
}
