"use client";

import React, { useEffect } from "react";
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

export default function RightBar() {
  const dispatch = useAppDispatch();
  const { settings } = useAppSelector((state) => state.settings);
  const { user } = useAppSelector((state) => state.auth);
  const { userFocus } = useAppSelector((state) => state.feed);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    if (user?.id) dispatch(fetchSettings(user.id));
  }, [user, dispatch]);

  if (!settings) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className={`${isDarkMode ? "text-white" : "text-black"}`}>
          Loading settings...
        </p>
      </div>
    );
  }

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
      className={`h-full ${
        isDarkMode ? "bg-black/50 md:bg-gray-400/5" : "bg-gray-500/10"
      } backdrop-blur-sm`}
    >
      <div className="p-5 space-y-6">
        <div>
          <p className="text-lg font-normal border-l-2 border-blue-400 pl-3 mb-3">
            Feed Sources
          </p>
          <div className="space-y-2">
            {availableSources.map((source) => (
              <div
                key={source}
                className={`flex items-center space-x-3 ${
                  isDarkMode ? "bg-white/5" : "bg-gray-100/50 "
                } p-3 backdrop-blur`}
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
                  className=" text-sm font-light cursor-pointer"
                >
                  {source}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-lg font-normal  border-l-2 border-blue-400 pl-3 mb-3">
            Scroll Speed
          </p>
          <div
            className={` ${
              isDarkMode ? "bg-white/5" : "bg-gray-100/50 "
            } p-4 backdrop-blur`}
          >
            <Slider
              min={1}
              max={3}
              step={1}
              value={[settings.scrollSpeed]}
              onValueChange={(val) => handleScrollSpeedChange(val[0])}
            />
            <div className="flex justify-between text-xs mt-2">
              <span>Slow</span>
              <span>Medium</span>
              <span>Fast</span>
            </div>
          </div>
        </div>

        <div>
          <p className="text-lg font-normal  border-l-2 border-blue-400 pl-3 mb-3">
            Sort By
          </p>
          <div className={` ${isDarkMode ? "bg-white/5" : "bg-gray-100/50 "}`}>
            <Select
              value={settings.sortingPreference}
              onValueChange={(val) =>
                handleSortChange(val as UserSettings["sortingPreference"])
              }
            >
              <SelectTrigger className=" w-full outline-none rounded-none border-0">
                <SelectValue placeholder="Select sort option" />
              </SelectTrigger>
              <SelectContent
                className={`rounded-none border-0 ${
                  isDarkMode && "bg-white/5 text-white"
                }`}
              >
                {sortOptions.map((option) => (
                  <SelectItem
                    key={option}
                    value={option}
                    className=" capitalize rounded-none"
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
