import React from "react";

export default function RightBarSkeleton() {
  return (
    <div className="h-full bg-black/50 md:bg-gray-400/5 backdrop-blur-sm animate-pulse">
      <div className="p-5 space-y-6">
        {/* Feed Sources Section */}
        <div>
          <div className="h-6 w-48 bg-gray-400/20 rounded mb-4 border-l-2 border-blue-400/30 pl-3"></div>
          <div className="space-y-2">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white/5 p-3 backdrop-blur">
                <div className="flex items-center space-x-3">
                  <div className="h-5 w-5 bg-gray-400/20 rounded"></div>
                  <div className="h-4 w-20 bg-gray-400/20 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Speed Section */}
        <div>
          <div className="h-6 w-40 bg-gray-400/20 rounded mb-4 border-l-2 border-blue-400/30 pl-3"></div>
          <div className="bg-white/5 p-4 backdrop-blur">
            <div className="h-2 bg-gray-400/20 rounded w-full"></div>
            <div className="flex justify-between text-xs mt-2">
              <div className="h-4 w-8 bg-gray-400/20 rounded"></div>
              <div className="h-4 w-12 bg-gray-400/20 rounded"></div>
              <div className="h-4 w-8 bg-gray-400/20 rounded"></div>
            </div>
          </div>
        </div>

        {/* Sort By Section */}
        <div>
          <div className="h-6 w-32 bg-gray-400/20 rounded mb-4 border-l-2 border-blue-400/30 pl-3"></div>
          <div className="bg-white/5">
            <div className="h-10 bg-gray-400/20 rounded-none border-0"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
