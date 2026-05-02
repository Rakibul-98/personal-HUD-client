/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks";
import { setUserFocus, fetchFeeds, fetchUserFocus, addFocusKeyword, removeFocusKeyword } from "../../../Redux/slices/feedSlice";
import { logAnalyticsEvent } from "../../../lib/analytics";
import { useTheme } from "../../ThemeProvider/ThemeProvider";

interface FocusModalProps {
  onClose: () => void;
}

export default function FocusModal({ onClose }: FocusModalProps) {
  const dispatch = useAppDispatch();
  const { userFocus } = useAppSelector((s) => s.feed);
  const { settings } = useAppSelector((s) => s.settings);
  const { isDarkMode } = useTheme();
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    dispatch(fetchUserFocus());
  }, [dispatch]);

  const addTag = async (tag: string) => {
    const lower = tag.toLowerCase().trim();
    if (!lower) return;
    if (userFocus.includes(lower)) {
      setError(`"${lower}" is already in your focus list`);
      return;
    }
    setError("");
    try {
      const updated = await dispatch(addFocusKeyword({ keyword: lower })).unwrap();
      logAnalyticsEvent({ eventType: "KEYWORD_FOCUS", data: { keyword: lower } });
      dispatch(setUserFocus(updated));
      dispatch(fetchFeeds({ userFocus: { topics: updated }, feedSources: settings?.feedSources ?? null, sortingPreference: settings?.sortingPreference }));
      setInputValue("");
    } catch (err: any) {
      setError(err?.message || "Failed to add topic");
    }
  };

  const removeTag = async (tag: string) => {
    try {
      const updated = await dispatch(removeFocusKeyword({ keyword: tag })).unwrap();
      logAnalyticsEvent({ eventType: "KEYWORD_REMOVE", data: { keyword: tag } });
      dispatch(setUserFocus(updated));
      dispatch(fetchFeeds({ userFocus: { topics: updated }, feedSources: settings?.feedSources ?? null, sortingPreference: settings?.sortingPreference }));
    } catch {
      // silent
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end lg:hidden ${isDarkMode ? "bg-black/40" : "bg-black/20"} backdrop-blur-sm`}
      onClick={onClose}
    >
      <div
        className={`w-full rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto ${isDarkMode ? "bg-gray-900" : "bg-white"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-semibold">Your Focus Topics</h2>
            <p className="text-xs text-gray-400 mt-0.5">{userFocus.length}/20 topics</p>
          </div>
          <button onClick={onClose} className={`p-2 rounded-lg ${isDarkMode ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-600"}`}>
            <X size={20} />
          </button>
        </div>

        <div className="mb-5">
          <div className="flex gap-2">
            <input
              className={`flex-1 p-3 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 border ${isDarkMode ? "bg-gray-800/60 border-gray-700 text-white placeholder-gray-500" : "bg-gray-50 border-gray-200"
                }`}
              type="text"
              placeholder="e.g. AI, React, startups…"
              value={inputValue}
              onChange={(e) => { setInputValue(e.target.value); setError(""); }}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(inputValue); } }}
            />
            <button
              onClick={() => addTag(inputValue)}
              disabled={!inputValue.trim()}
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 disabled:opacity-40 transition-colors"
            >
              Add
            </button>
          </div>
          {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
        </div>

        {userFocus.length > 0 ? (
          <div>
            <p className="text-xs font-semibold mb-3 text-gray-400 uppercase tracking-wider">Active Topics</p>
            <div className="flex flex-wrap gap-2">
              {userFocus.map((tag, i) => (
                <span
                  key={i}
                  className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-2 ${isDarkMode ? "bg-blue-500/20 text-blue-300" : "bg-blue-100 text-blue-700"
                    }`}
                >
                  {tag}
                  <button onClick={() => removeTag(tag)} className="hover:text-red-400 transition-colors" title={`Remove ${tag}`}>
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-4">No topics yet. Add some above to filter your feed.</p>
        )}
      </div>
    </div>
  );
}
