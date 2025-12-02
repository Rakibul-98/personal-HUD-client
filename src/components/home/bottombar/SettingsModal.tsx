"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "../../ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks";
import {
  fetchSettings,
  updateSettings,
  UserSettings,
} from "../../../Redux/slices/settingsSlice";
import { fetchFeeds } from "../../../Redux/slices/feedSlice";
import { useTheme } from "../../ThemeProvider/ThemeProvider";

interface SettingsModalProps {
  onClose: () => void;
}

export default function SettingsModal({ onClose }: SettingsModalProps) {
  const dispatch = useAppDispatch();
  const { settings } = useAppSelector((state) => state.settings);
  const { user } = useAppSelector((state) => state.auth);
  const { userFocus } = useAppSelector((state) => state.feed);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    if (user?.id) dispatch(fetchSettings(user.id));
  }, [user, dispatch]);

  if (!settings) return console.log("Error loading settings!");

  const availableSources: (keyof UserSettings["feedSources"])[] = [
    "reddit",
    "hackerNews",
    "devTo",
  ];

  const sortOptions: UserSettings["sortingPreference"][] = [
    "latest",
    "rank",
    "popularity",
  ];

  const handleSourceChange = async (
    source: keyof UserSettings["feedSources"]
  ) => {
    if (!settings || !user?.id) return;

    const updatedSources: UserSettings["feedSources"] = {
      ...settings.feedSources,
      [source]: !settings.feedSources[source],
    };

    try {
      await dispatch(
        updateSettings({
          userId: user.id,
          updates: { feedSources: updatedSources },
        })
      ).unwrap();

      await dispatch(
        fetchFeeds({
          userFocus: { topics: userFocus },
          userId: user.id,
          feedSources: updatedSources,
          sortingPreference: settings.sortingPreference,
        })
      );
    } catch (err) {
      console.error("Error updating source:", err);
    }
  };

  const handleScrollSpeedChange = async (value: number) => {
    if (!settings || !user?.id) return;
    try {
      await dispatch(
        updateSettings({ userId: user.id, updates: { scrollSpeed: value } })
      ).unwrap();
    } catch (err) {
      console.error("Failed to save scroll speed:", err);
    }
  };

  const handleSortChange = async (sort: UserSettings["sortingPreference"]) => {
    if (!settings || !user?.id) return;
    try {
      await dispatch(
        updateSettings({
          userId: user.id,
          updates: { sortingPreference: sort },
        })
      ).unwrap();

      await dispatch(
        fetchFeeds({
          userFocus: { topics: userFocus },
          userId: user.id,
          feedSources: settings.feedSources,
          sortingPreference: sort,
        })
      );
    } catch (err) {
      console.error("Failed to change sort:", err);
    }
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
          <h2 className="text-xl font-semibold">Settings</h2>
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

        {/* Feed Sources */}
        <div className="mb-6">
          <p className="text-sm font-semibold mb-3 text-gray-400">
            Feed Sources
          </p>
          <div className="space-y-2">
            {availableSources.map((source) => (
              <div
                key={source}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isDarkMode ? "bg-gray-800/50" : "bg-gray-100/50"
                }`}
              >
                <Checkbox
                  id={source}
                  checked={settings.feedSources[source]}
                  onCheckedChange={() => handleSourceChange(source)}
                  className={`${
                    isDarkMode
                      ? "data-[state=checked]:bg-blue-400"
                      : "border-black"
                  }`}
                />
                <label
                  htmlFor={source}
                  className="text-sm font-light cursor-pointer capitalize flex-1"
                >
                  {source}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Speed */}
        <div className="mb-6">
          <p className="text-sm font-semibold mb-3 text-gray-400">
            Scroll Speed
          </p>
          <div
            className={`p-4 rounded-lg ${
              isDarkMode ? "bg-gray-800/50" : "bg-gray-100/50"
            }`}
          >
            <Slider
              min={1}
              max={3}
              step={1}
              value={[settings.scrollSpeed]}
              onValueChange={(val) => handleScrollSpeedChange(val[0])}
            />
            <div className="flex justify-between text-xs mt-3 text-gray-500">
              <span>Slow</span>
              <span>Medium</span>
              <span>Fast</span>
            </div>
          </div>
        </div>

        {/* Sort By */}
        <div>
          <p className="text-sm font-semibold mb-3 text-gray-400">Sort By</p>
          <div
            className={`rounded-lg overflow-hidden ${
              isDarkMode ? "bg-gray-800/50" : "bg-gray-100/50"
            }`}
          >
            <Select
              value={settings.sortingPreference}
              onValueChange={(val) =>
                handleSortChange(val as UserSettings["sortingPreference"])
              }
            >
              <SelectTrigger
                className={`w-full outline-none rounded-none border-0 ${
                  isDarkMode ? "bg-gray-800/50" : "bg-gray-100/50"
                }`}
              >
                <SelectValue placeholder="Select sort option" />
              </SelectTrigger>
              <SelectContent
                className={`rounded-lg border-0 ${
                  isDarkMode && "bg-gray-800 text-white"
                }`}
              >
                {sortOptions.map((option) => (
                  <SelectItem
                    key={option}
                    value={option}
                    className="capitalize rounded-lg"
                  >
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
