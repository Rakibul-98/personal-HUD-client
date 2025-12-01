"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks";
import {
  setUserFocus,
  fetchFeeds,
  fetchUserFocus,
  addFocusKeyword,
  removeFocusKeyword,
} from "../../../Redux/slices/feedSlice";
import { useTheme } from "../../ThemeProvider/ThemeProvider";

interface FocusModalProps {
  onClose: () => void;
}

export default function FocusModal({ onClose }: FocusModalProps) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { userFocus } = useAppSelector((state) => state.feed);
  const { settings } = useAppSelector((state) => state.settings);
  const { isDarkMode } = useTheme();

  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserFocus(user.id));
    }
  }, [user, dispatch]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      addTag(inputValue.trim());
    }
  };

  const addTag = async (tag: string) => {
    if (tag && !userFocus.includes(tag)) {
      try {
        const result = await dispatch(
          addFocusKeyword({ userId: user!.id, keyword: tag })
        ).unwrap();
        const updated = result;
        dispatch(setUserFocus(updated));
        await dispatch(
          fetchFeeds({
            userFocus: { topics: updated },
            userId: user!.id,
            feedSources: settings?.feedSources ?? null,
            sortingPreference: settings?.sortingPreference,
          })
        );
        setInputValue("");
      } catch (err) {
        console.error("Failed to add focus:", err);
      }
    }
  };

  const removeTag = async (tagToRemove: string) => {
    try {
      const result = await dispatch(
        removeFocusKeyword({ userId: user!.id, keyword: tagToRemove })
      ).unwrap();
      const updated = result;
      dispatch(setUserFocus(updated));
      await dispatch(
        fetchFeeds({
          userFocus: { topics: updated },
          userId: user!.id,
          feedSources: settings?.feedSources ?? null,
          sortingPreference: settings?.sortingPreference,
        })
      );
    } catch (err) {
      console.error("Failed to remove focus:", err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end lg:hidden ${
        isDarkMode ? "bg-black/40" : "bg-black/20"
      } backdrop-blur-sm`}
      onClick={onClose}
    >
      <div
        className={`w-full rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto ${
          isDarkMode ? "bg-gray-900" : "bg-white"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">What&apos;s your focus?</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode
                ? "hover:bg-gray-800 text-gray-400"
                : "hover:bg-gray-100 text-gray-600"
            }`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Input */}
        <div className="mb-6">
          <input
            className={`w-full p-3 rounded-lg focus:outline-none transition-colors ${
              isDarkMode
                ? "bg-gray-800/50 border-gray-700/50 focus:border-blue-500/50 focus:bg-gray-800/80"
                : "bg-gray-100/50 border-gray-300/50 focus:border-blue-400/50 focus:bg-gray-100/80"
            } border`}
            type="text"
            placeholder="eg: coding, AI/ML ..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
        </div>

        {/* Tags */}
        {userFocus.length > 0 && (
          <div>
            <p className="text-sm font-semibold mb-3 text-gray-400">
              Your Focus Keywords
            </p>
            <div className="flex flex-wrap gap-2">
              {userFocus.map((tag, index) => (
                <span
                  key={index}
                  className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${
                    isDarkMode
                      ? "bg-blue-500/20 text-blue-300 hover:bg-blue-500/30"
                      : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  }`}
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className={`hover:text-red-500 cursor-pointer transition-colors ${
                      isDarkMode ? "text-blue-400" : "text-blue-600"
                    }`}
                  >
                    <X size={16} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
