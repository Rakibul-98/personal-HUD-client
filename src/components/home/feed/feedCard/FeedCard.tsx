import React from "react";
import Link from "next/link";
import { Bookmark, ExternalLink, Hash, TrendingUp } from "lucide-react";

export default function FeedCard() {
  const dummyData = {
    title:
      "OpenAI admits AI hallucinations are mathematically inevitable, not just engineering flaws",
    content:
      "https://www.computerworld.com/article/4059383/openai-admits-ai-hallucinations-are-mathematically-inevitable-not-just-engineering-flaws.html",
    source: "Reddit",
    category: "technology",
    popularityScore: 20146,
  };

  return (
    <div className="bg-white/5 backdrop-blur rounded-sm p-6 hover:bg-white/10 transition-all duration-300">
      <div className="mb-4">
        <Link
          href={dummyData.content}
          target="_blank"
          rel="noopener noreferrer"
          className="group hover:underline flex items-start justify-between"
        >
          <h3 className="text-lg font-medium mb-2 pr-5 leading-relaxed">
            {dummyData.title}
          </h3>
          <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-blue-500 mt-1" />
        </Link>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-300">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 bg-white/5 px-2 py-1 rounded">
            <Hash className="h-3 w-3" />
            <span>{dummyData.source}</span>
          </div>
          <span className="bg-white/5 px-2 py-1 rounded capitalize">
            {dummyData.category}
          </span>

          <div className="flex items-center space-x-1">
            <TrendingUp className="h-3 w-3" />
            <span>{dummyData.popularityScore.toLocaleString()}</span>
          </div>
        </div>

        <button className="cursor-pointer">
          <Bookmark className="h-6 w-6" />
        </button>
      </div>

      <div className="h-px bg-gradient-to-r from-blue-400/30 to-transparent mt-4"></div>
    </div>
  );
}
