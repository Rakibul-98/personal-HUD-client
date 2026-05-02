"use client";

import React, { useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "../../ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks";
import { fetchSettings, updateSettings, UserSettings } from "../../../Redux/slices/settingsSlice";
import { fetchFeeds } from "../../../Redux/slices/feedSlice";
import { useTheme } from "../../ThemeProvider/ThemeProvider";
import RightBarSkeleton from "./RightBarSkeleton";

const SOURCE_LABELS: Record<string, string> = {
  reddit: "Reddit",
  hackerNews: "Hacker News",
  devTo: "Dev.to",
};

export default function RightBar() {
  const dispatch = useAppDispatch();
  const { settings } = useAppSelector((s) => s.settings);
  const { user } = useAppSelector((s) => s.auth);
  const { userFocus } = useAppSelector((s) => s.feed);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    if (user) dispatch(fetchSettings());
  }, [user, dispatch]);

  if (!settings) return <RightBarSkeleton />;

  const sources = (["reddit", "hackerNews", "devTo"] as const);
  const sortOptions = (["latest", "rank", "popularity"] as const);

  const handleSourceChange = async (source: keyof UserSettings["feedSources"]) => {
    const updated = { ...settings.feedSources, [source]: !settings.feedSources[source] };
    // Optimistic: update feed immediately
    dispatch(fetchFeeds({ userFocus: { topics: userFocus }, feedSources: updated, sortingPreference: settings.sortingPreference }));
    await dispatch(updateSettings({ feedSources: updated }));
  };

  const handleScrollSpeed = async (value: number) => {
    await dispatch(updateSettings({ scrollSpeed: value }));
  };

  const handleSort = async (sort: UserSettings["sortingPreference"]) => {
    dispatch(fetchFeeds({ userFocus: { topics: userFocus }, feedSources: settings.feedSources, sortingPreference: sort }));
    await dispatch(updateSettings({ sortingPreference: sort }));
  };

  const bg = isDarkMode ? "bg-white/5" : "bg-gray-100/50";
  const sectionBg = isDarkMode ? "bg-black/50 md:bg-gray-400/5" : "bg-gray-500/10";

  return (
    <div className={`h-full ${sectionBg} backdrop-blur-sm`}>
      <div className="p-5 space-y-6">
        <div>
          <p className="text-sm font-semibold border-l-2 border-blue-400 pl-3 mb-3">Feed Sources</p>
          <div className="space-y-2">
            {sources.map((source) => (
              <div key={source} className={`flex items-center gap-3 ${bg} p-3`}>
                <Checkbox
                  id={`rb-${source}`}
                  checked={settings.feedSources[source]}
                  onCheckedChange={() => handleSourceChange(source)}
                  className={isDarkMode ? "data-[state=checked]:bg-blue-400" : "border-black"}
                />
                <label htmlFor={`rb-${source}`} className="text-sm cursor-pointer select-none flex-1">
                  {SOURCE_LABELS[source]}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold border-l-2 border-blue-400 pl-3 mb-3">Scroll Speed</p>
          <div className={`${bg} p-4`}>
            <Slider min={1} max={3} step={1} value={[settings.scrollSpeed]} onValueChange={(v) => handleScrollSpeed(v[0])} />
            <div className="flex justify-between text-xs mt-2 text-gray-500">
              <span>Slow</span><span>Medium</span><span>Fast</span>
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold border-l-2 border-blue-400 pl-3 mb-3">Sort By</p>
          <div className={bg}>
            <Select value={settings.sortingPreference} onValueChange={(v) => handleSort(v as UserSettings["sortingPreference"])}>
              <SelectTrigger className="w-full rounded-none border-0 outline-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={`rounded-none border-0 ${isDarkMode && "bg-gray-800 text-white"}`}>
                {sortOptions.map((o) => (
                  <SelectItem key={o} value={o} className="capitalize rounded-none">{o}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
