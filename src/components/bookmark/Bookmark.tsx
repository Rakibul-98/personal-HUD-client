import React from "react";
import FeedCard from "../home/feed/feedCard/FeedCard";

export default function Bookmark() {
  return (
    <div
      className="h-full overflow-scroll"
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <div className="px-3">
        <div className="">
          <main className="space-y-3 h-[calc(100vh-200px)]">
            {[...Array(5)].map((_, index) => (
              <FeedCard key={index} />
            ))}
          </main>
        </div>
      </div>
    </div>
  );
}
