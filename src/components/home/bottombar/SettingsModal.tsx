"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "../../ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks";
import { fetchSettings, updateSettings, UserSettings } from "../../../Redux/slices/settingsSlice";
import { fetchFeeds } from "../../../Redux/slices/feedSlice";
import { useTheme } from "../../ThemeProvider/ThemeProvider";

const SOURCE_LABELS: Record<string, string> = {
  reddit: "Reddit",
  hackerNews: "Hacker News",
  devTo: "Dev.to",
};

interface SettingsModalProps {
  onClose: () => void;
}

export default function SettingsModal({ onClose }: SettingsModalProps) {
  const dispatch = useAppDispatch();
  const { settings } = useAppSelector((s) => s.settings);
  const { userFocus } = useAppSelector((s) => s.feed);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  if (!settings) {
    return (
      <div className={`fixed inset-0 z-50 flex items-end lg:hidden ${isDarkMode ? "bg-black/40" : "bg-black/20"} backdrop-blur-sm`}>
        <div className={`w-full rounded-t-2xl p-6 ${isDarkMode ? "bg-gray-900 text-white" : "bg-white"}`}>
          <p className="text-center text-sm text-gray-400">Loading settings…</p>
        </div>
      </div>
    );
  }

  const sources = (["reddit", "hackerNews", "devTo"] as const);
  const sortOptions = (["latest", "rank", "popularity"] as const);

  const handleSourceChange = async (source: keyof UserSettings["feedSources"]) => {
    const updated = { ...settings.feedSources, [source]: !settings.feedSources[source] };
    // Optimistic feed refresh — don't wait for settings save
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

  const bg = isDarkMode ? "bg-gray-800/60" : "bg-gray-100/60";

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end lg:hidden ${isDarkMode ? "bg-black/40" : "bg-black/20"} backdrop-blur-sm`}
      onClick={onClose}
    >
      <div
        className={`w-full rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto ${isDarkMode ? "bg-gray-900" : "bg-white"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Sources & Settings</h2>
          <button onClick={onClose} className={`p-2 rounded-lg ${isDarkMode ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-600"}`}>
            <X size={20} />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-xs font-semibold mb-3 text-gray-400 uppercase tracking-wider">Feed Sources</p>
          <div className="space-y-2">
            {sources.map((source) => (
              <div key={source} className={`flex items-center gap-3 p-3 rounded-lg ${bg}`}>
                <Checkbox
                  id={`sm-${source}`}
                  checked={settings.feedSources[source]}
                  onCheckedChange={() => handleSourceChange(source)}
                  className={isDarkMode ? "data-[state=checked]:bg-blue-400" : "border-black"}
                />
                <label htmlFor={`sm-${source}`} className="text-sm cursor-pointer select-none flex-1">
                  {SOURCE_LABELS[source]}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <p className="text-xs font-semibold mb-3 text-gray-400 uppercase tracking-wider">Scroll Speed</p>
          <div className={`p-4 rounded-lg ${bg}`}>
            <Slider min={1} max={3} step={1} value={[settings.scrollSpeed]} onValueChange={(v) => handleScrollSpeed(v[0])} />
            <div className="flex justify-between text-xs mt-3 text-gray-500">
              <span>Slow</span><span>Medium</span><span>Fast</span>
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold mb-3 text-gray-400 uppercase tracking-wider">Sort By</p>
          <div className={`rounded-lg overflow-hidden ${bg}`}>
            <Select value={settings.sortingPreference} onValueChange={(v) => handleSort(v as UserSettings["sortingPreference"])}>
              <SelectTrigger className="w-full border-0 rounded-none outline-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={`rounded-lg border-0 ${isDarkMode && "bg-gray-800 text-white"}`}>
                {sortOptions.map((o) => (
                  <SelectItem key={o} value={o} className="capitalize rounded-lg">{o}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
