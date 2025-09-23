"use client";

import Link from "next/link";
import { Button } from "../../ui/button";

export default function LeftBar() {
  const dummyFocusTags = ["coding", "AI/ML", "design"];

  return (
    <div>
      <div>
        <p>logged in User name</p>
        <nav className="flex flex-col">
          <Link href="/feed">Feed</Link>
          <Link href="/bookmark">Bookmarks</Link>
        </nav>
        <div>
          <label>Your current focus</label>
          <input
            className="border"
            type="text"
            placeholder="eg: coding, AI/ML"
          />

          <div className="">
            <div className="flex flex-wrap gap-2">
              {dummyFocusTags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 rounded text-xs flex items-center gap-1"
                >
                  {tag}
                  <button
                    onClick={() => console.log(`Remove: ${tag}`)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
        <Button variant="destructive">logout</Button>
      </div>
    </div>
  );
}
