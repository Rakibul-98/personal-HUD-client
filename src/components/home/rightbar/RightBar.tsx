"use client";

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "../../ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

export default function RightBar() {
  const availableSources = [
    { id: "reddit", label: "Reddit" },
    { id: "hackernews", label: "Hacker News" },
    { id: "devto", label: "Dev.to" },
  ];

  const sortOptions = [
    { value: "latest", label: "Latest" },
    { value: "popular", label: "Most Popular" },
    { value: "trending", label: "Trending" },
    { value: "relevant", label: "Most Relevant" },
  ];

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
                key={source.id}
                className="flex items-center space-x-3 bg-white/5 p-3 backdrop-blur"
              >
                <Checkbox id={source.id} />
                <label
                  htmlFor={source.id}
                  className="text-gray-200 text-sm font-light cursor-pointer"
                >
                  {source.label}
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
            <Slider defaultValue={[3]} max={5} step={1} />
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
            <Select defaultValue="latest">
              <SelectTrigger className="bg-white/10 border-white/20 text-gray-200 w-full outline-none rounded-none">
                <SelectValue placeholder="Select sort option" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-white/20">
                {sortOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="text-gray-200 hover:bg-white/10"
                  >
                    {option.label}
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
