"use client";

import Link from "next/link";
import { Button } from "../../ui/button";
import { Bookmark, Newspaper, X } from "lucide-react";
import { useState } from "react";

export default function LeftBar() {
  const [focusTags, setFocusTags] = useState(["coding", "AI/ML", "design"]);
  const [inputValue, setInputValue] = useState("");
  const user = "Rakibul Hasan";

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      addTag(inputValue.trim());
    }
  };

  const addTag = (tag: string) => {
    if (tag && !focusTags.includes(tag)) {
      setFocusTags([...focusTags, tag]);
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFocusTags(focusTags.filter((tag) => tag !== tagToRemove));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-5 flex-1">
        <p className="text-lg font-normal text-gray-100 border-l-2 border-blue-400 pl-3">
          Welcome, {user}
        </p>

        <nav className="flex flex-col space-y-2 my-4">
          <Link
            href="/feed"
            className="flex gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 transition-all duration-300 backdrop-blur"
          >
            <Newspaper />
            Feed
          </Link>
          <Link
            href="/bookmark"
            className="flex gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 transition-all duration-300 backdrop-blur"
          >
            <Bookmark />
            Bookmarks
          </Link>
        </nav>

        <div className="my-4">
          <label className="block mb-2">What&apos;s your focus today?</label>
          <input
            className="bg-gray-100/20 focus:outline-0 p-2 w-full text-white placeholder-gray-400"
            type="text"
            placeholder="eg: coding, AI/ML"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />

          {focusTags.length > 0 && (
            <div className="mt-3">
              <div className="flex flex-wrap gap-2">
                {focusTags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-500 rounded-sm text-xs flex items-center gap-1"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="hover:text-red-600 cursor-pointer border-s ps-1 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-5 border-t border-white/10">
        <Button
          className="w-full rounded-none cursor-pointer"
          variant="destructive"
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
