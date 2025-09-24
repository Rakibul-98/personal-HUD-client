"use client";

import React from "react";
import { Button } from "../../../ui/button";
import { Play, Pause, Zap } from "lucide-react";

interface FeedMenuProps {
  isAutoScroll: boolean;
  onAutoScrollToggle: () => void;
  onFetchNow: () => void;
}

export default function FeedMenu({
  isAutoScroll,
  onAutoScrollToggle,
  onFetchNow,
}: FeedMenuProps) {
  return (
    <div className="mb-3">
      <div className="flex justify-between gap-3 items-center bg-white/5 backdrop-blur p-3">
        <h3 className="text-xl font-semibold capitalize">
          All Your need is here
        </h3>
        <div className="flex gap-3">
          <button
            onClick={onAutoScrollToggle}
            className="bg-gray-100/10 hover:bg-gray-100/20 py-1 px-2 cursor-pointer"
          >
            {isAutoScroll ? (
              <div className="flex gap-1 items-center">
                <Pause className="h-4 w-4" />
                <p>Stop Auto Scroll</p>
              </div>
            ) : (
              <div className="flex gap-1 items-center">
                <Play className="h-4 w-4" />
                <p>Start Auto Scroll</p>
              </div>
            )}
          </button>
          <Button
            onClick={onFetchNow}
            className="bg-gray-100/10 hover:bg-gray-100/20 rounded-none cursor-pointer"
          >
            <Zap size={20} /> Fetch Now
          </Button>
        </div>
      </div>
    </div>
  );
}
