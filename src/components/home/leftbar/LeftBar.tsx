"use client";

import { Button } from "../../ui/button";
import { X } from "lucide-react";
import { useState } from "react";
import Navigation from "./Navigation";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks";
import { setUserFocus, fetchFeeds } from "../../../Redux/slices/feedSlice";
import { logout } from "../../../Redux/slices/authSlice";
import { useRouter } from "next/navigation";

export default function LeftBar() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const { userFocus } = useAppSelector((state) => state.feed);

  const [inputValue, setInputValue] = useState("");

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      addTag(inputValue.trim());
    }
  };

  const addTag = (tag: string) => {
    if (tag && !userFocus.includes(tag)) {
      const updated = [...userFocus, tag];
      dispatch(setUserFocus(updated));
      dispatch(
        fetchFeeds({ userFocus: { topics: updated }, userId: user?.id })
      );
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const updated = userFocus.filter((tag) => tag !== tagToRemove);
    dispatch(setUserFocus(updated));
    dispatch(fetchFeeds({ userFocus: { topics: updated }, userId: user?.id }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleLogout = () => {
    router.push("/");
    dispatch(logout());
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-5 flex-1">
        <p className="text-lg font-normal text-gray-100 border-l-2 border-blue-400 pl-3">
          Welcome,{" "}
          <span className="text-blue-400 font-medium">
            {user?.name || "Guest"}
          </span>
        </p>
        <Navigation />

        <div className="my-4">
          <label className="block mb-2">What&apos;s your focus today?</label>
          <input
            className="bg-gray-100/10 border border-gray-100/50 focus:outline-0 p-2 w-full placeholder-gray-500"
            type="text"
            placeholder="eg: coding, AI/ML ..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />

          {userFocus.length > 0 && (
            <div className="mt-3">
              <div className="flex flex-wrap gap-2">
                {userFocus.map((tag, index) => (
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
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
