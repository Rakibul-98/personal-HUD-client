"use client";

import { Button } from "../../ui/button";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import Navigation from "./Navigation";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks";
import {
  setUserFocus, fetchFeeds, fetchUserFocus,
  addFocusKeyword, removeFocusKeyword,
} from "../../../Redux/slices/feedSlice";
import { logout } from "../../../Redux/slices/authSlice";
import { logAnalyticsEvent } from "../../../lib/analytics";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "../../ThemeProvider/ThemeProvider";

export default function LeftBar() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector((s) => s.auth);
  const { userFocus } = useAppSelector((s) => s.feed);
  const { settings } = useAppSelector((s) => s.settings);
  const pathname = usePathname();
  const [inputValue, setInputValue] = useState("");
  const { isDarkMode } = useTheme();

  useEffect(() => {
    if (user) dispatch(fetchUserFocus());
  }, [user, dispatch]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue.trim());
    }
  };

  const addTag = async (tag: string) => {
    const lower = tag.toLowerCase();
    if (!lower || userFocus.includes(lower)) { setInputValue(""); return; }
    try {
      // No longer passing userId — backend gets it from token
      const updated = await dispatch(addFocusKeyword({ keyword: lower })).unwrap();
      logAnalyticsEvent({ eventType: "KEYWORD_FOCUS", data: { keyword: lower } });
      dispatch(setUserFocus(updated));
      dispatch(fetchFeeds({ userFocus: { topics: updated }, feedSources: settings?.feedSources ?? null, sortingPreference: settings?.sortingPreference }));
      setInputValue("");
    } catch (err) {
      console.error("Failed to add focus:", err);
    }
  };

  const removeTag = async (tag: string) => {
    try {
      const updated = await dispatch(removeFocusKeyword({ keyword: tag })).unwrap();
      logAnalyticsEvent({ eventType: "KEYWORD_REMOVE", data: { keyword: tag } });
      dispatch(setUserFocus(updated));
      dispatch(fetchFeeds({ userFocus: { topics: updated }, feedSources: settings?.feedSources ?? null, sortingPreference: settings?.sortingPreference }));
    } catch (err) {
      console.error("Failed to remove focus:", err);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  const bg = isDarkMode ? "bg-black/50 md:bg-gray-400/5" : "bg-gray-500/10";

  return (
    <div className={`h-full flex flex-col ${bg} backdrop-blur-sm`}>
      <div className="p-3 flex-1 overflow-y-auto">
        <p className="text-lg font-normal border-l-2 border-blue-400 pl-3 mb-3">
          Welcome, <span className="text-blue-500 font-medium">{user?.name || "Guest"}</span>
        </p>
        <Navigation />

        {pathname !== "/bookmark" && (
          <div className="my-4">
            <label className="block text-sm mb-2 font-medium">What&apos;s your focus?</label>
            <input
              className={`border focus:outline-none focus:ring-1 focus:ring-blue-500 p-2 w-full text-sm placeholder-gray-500 ${isDarkMode
                  ? "bg-gray-100/10 border-gray-100/20"
                  : "border-gray-300 bg-gray-100/50"
                }`}
              type="text"
              placeholder="e.g. AI, web dev, startups…"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <p className="text-xs text-gray-400 mt-1">Press Enter to add</p>

            {userFocus.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {userFocus.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-sm text-xs flex items-center gap-1"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="hover:text-red-400 cursor-pointer border-l border-blue-400/40 pl-1 transition-colors"
                      title={`Remove ${tag}`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="p-3 border-t border-gray-500/30 flex-shrink-0">
        <Button
          className="w-full rounded-none cursor-pointer bg-red-500/70 hover:bg-red-500 text-white"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
