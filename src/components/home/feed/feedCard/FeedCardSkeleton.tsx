import React from "react";

export default function FeedCardSkeleton() {
  return (
    <div className="bg-white/5 backdrop-blur rounded-sm p-6 animate-pulse">
      <div className="mb-4">
        <div className="h-6 bg-gray-400/20 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-400/10 rounded w-full"></div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-300">
        <div className="flex items-center space-x-4">
          <div className="h-4 w-12 bg-gray-400/20 rounded"></div>
          <div className="h-4 w-10 bg-gray-400/20 rounded"></div>
          <div className="h-4 w-14 bg-gray-400/20 rounded"></div>
        </div>
        <div className="h-6 w-6 bg-gray-400/20 rounded-full"></div>
      </div>

      <div className="h-px bg-gradient-to-r from-blue-400/30 to-transparent mt-4"></div>
    </div>
  );
}
