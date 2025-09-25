"use client";

import { Button } from "../../ui/button";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import Navigation from "./Navigation";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks";
import {
  setUserFocus,
  fetchFeeds,
  fetchUserFocus,
  addFocusKeyword,
  removeFocusKeyword,
} from "../../../Redux/slices/feedSlice";
import { logout } from "../../../Redux/slices/authSlice";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "../../ThemeProvider/ThemeProvider";

export default function LeftBar() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const { userFocus } = useAppSelector((state) => state.feed);
  const { settings } = useAppSelector((state) => state.settings);
  const pathname = usePathname();

  const [inputValue, setInputValue] = useState("");
  const { isDarkMode } = useTheme();
  useEffect(() => {
    if (user?.id) {
      // load persisted user focus from backend
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

  const handleLogout = () => {
    router.push("/");
    dispatch(logout());
  };

  return (
    <div
      className={`h-full flex flex-col ${
        isDarkMode ? "bg-black/50 md:bg-gray-400/5" : "bg-gray-500/10"
      } backdrop-blur-sm`}
    >
      <div className="p-5 flex-1">
        <p className="text-lg font-normal border-l-2 border-blue-400 pl-3">
          Welcome,{" "}
          <span className="text-blue-500 font-medium">
            {user?.name || "Guest"}
          </span>
        </p>
        <Navigation />
        {pathname !== "/bookmark" && (
          <div className="my-4">
            <label className="block mb-2">What&apos;s your focus today?</label>
            <input
              className={`${
                isDarkMode
                  ? "bg-gray-100/10 border-gray-100/50"
                  : "border-gray-500 bg-gray-100/50"
              } border  focus:outline-0 p-2 w-full placeholder-gray-500`}
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
                      className="px-2 py-1 bg-gray-500 rounded-sm text-xs flex items-center gap-1 text-white"
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
        )}
      </div>

      <div className="p-5 border-t border-gray-500">
        <Button
          className="w-full rounded-none cursor-pointer bg-red-500/80 hover:bg-red-500"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
