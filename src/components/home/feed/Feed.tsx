import React from "react";
import FeedMenu from "./feedMenu/FeedMenu";
import FeedCard from "./feedCard/FeedCard";

export default function Feed() {
  return (
    <div>
      <div className="h-[calc(100vh-30px)] overflow-scroll">
        <FeedMenu />
        <main className="space-y-3">
          {/* dynamically display fetched feed items */}
          {[...Array(10)].map((_, index) => (
            <FeedCard key={index} />
          ))}
        </main>
      </div>
    </div>
  );
}
