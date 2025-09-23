"use client";

import React, { useState } from "react";
import { Button } from "../../../ui/button";
import { Play, Pause, Zap } from "lucide-react";

export default function FeedMenu() {
  const [isAutoScroll, setIsAutoScroll] = useState(true);

  return (
    <div className="mb-5">
      <div className="flex justify-between gap-3 items-center">
        <div>
          <button
            onClick={() => setIsAutoScroll((prev) => !prev)}
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
        </div>
        <div>
          <Button className="bg-gray-100/10 hover:bg-gray-100/20 rounded-none cursor-pointer">
            <Zap size={20} /> Fetch Now
          </Button>
        </div>
      </div>
    </div>
  );
}
