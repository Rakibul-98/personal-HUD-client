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

export default function RightBar() {
  const dispatch = useAppDispatch();
  const { settings } = useAppSelector((state) => state.settings);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (user?.id) dispatch(fetchSettings(user.id));
  }, [user, dispatch]);

  if (!settings)
    return <div className="p-5 text-gray-400">Loading settings...</div>;

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

  const handleSourceChange = (source: keyof UserSettings["feedSources"]) => {
    if (!settings || !user?.id) return;

    const updatedSources: UserSettings["feedSources"] = {
      ...settings.feedSources,
      [source]: !settings.feedSources[source],
    };

    dispatch(
      updateSettings({
        userId: user.id,
        updates: { feedSources: updatedSources },
      })
    );

    dispatch(fetchFeeds({ userFocus: { topics: [] }, userId: user.id }));
  };

  const handleScrollSpeedChange = (value: number) => {
    if (!settings || !user?.id) return;
    dispatch(
      updateSettings({ userId: user.id, updates: { scrollSpeed: value } })
    );
  };

  const handleSortChange = (sort: UserSettings["sortingPreference"]) => {
    if (!settings || !user?.id) return;
    dispatch(
      updateSettings({ userId: user.id, updates: { sortingPreference: sort } })
    );

    dispatch(fetchFeeds({ userFocus: { topics: [] }, userId: user.id }));
  };

  return (
    <div className="h-full">
      <div className="p-5 space-y-6">
        <div>
          <p className="text-lg font-normal text-gray-100 border-l-2 border-blue-400 pl-3 mb-3">
            Feed Sources
          </p>
          <div className="space-y-2">
            {availableSources.map((source) => (
              <div
                key={source}
                className="flex items-center space-x-3 bg-white/5 p-3 backdrop-blur"
              >
                <Checkbox
                  id={source}
                  checked={settings.feedSources[source]}
                  onCheckedChange={() => handleSourceChange(source)}
                />
                <label
                  htmlFor={source}
                  className="text-gray-200 text-sm font-light cursor-pointer"
                >
                  {source}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-lg font-normal text-gray-100 border-l-2 border-blue-400 pl-3 mb-3">
            Scroll Speed
          </p>
          <div className="bg-white/5 p-4 backdrop-blur">
            <Slider
              min={1}
              max={5}
              step={1}
              value={[settings.scrollSpeed]}
              onValueChange={(val) => handleScrollSpeedChange(val[0])}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>Slow</span>
              <span>Medium</span>
              <span>Fast</span>
            </div>
          </div>
        </div>

        <div>
          <p className="text-lg font-normal text-gray-100 border-l-2 border-blue-400 pl-3 mb-3">
            Sort By
          </p>
          <div className="bg-white/5 p-3 backdrop-blur">
            <Select
              value={settings.sortingPreference}
              onValueChange={(val) =>
                handleSortChange(val as UserSettings["sortingPreference"])
              }
            >
              <SelectTrigger className="bg-white/10 border-white/20 text-gray-200 w-full outline-none rounded-none">
                <SelectValue placeholder="Select sort option" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-white/20">
                {sortOptions.map((option) => (
                  <SelectItem
                    key={option}
                    value={option}
                    className="text-gray-200 hover:bg-white/10"
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
