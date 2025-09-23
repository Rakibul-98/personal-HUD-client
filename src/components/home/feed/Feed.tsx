import React from "react";
import FeedMenu from "./feedMenu/FeedMenu";
import FeedCard from "./feedCard/FeedCard";

export default function Feed() {
  return (
    <div className="p-5">
      <div className="">
        <FeedMenu />
        <main className="space-y-3 h-[calc(100vh-200px)] overflow-scroll">
          {/* dynamically display fetched feed items */}
          {[...Array(10)].map((_, index) => (
            <FeedCard key={index} />
          ))}
        </main>
      </div>
    </div>
  );
}
