import React from "react";
import Link from "next/link";
import { Button } from "../../../ui/button";
import { Bookmark } from "lucide-react";

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
    <div>
      <div className="border bg-amber-50">
        <Link
          href={dummyData.content}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h3>{dummyData.title}</h3>
        </Link>
        <div className="flex justify-between">
          <p>{dummyData.source}</p>
          <p>Category: {dummyData.category}</p>
          <p>Popularity: {dummyData.popularityScore}</p>
          <Button variant="secondary" size="icon" className="size-8">
            <Bookmark />
          </Button>
        </div>
      </div>
    </div>
  );
}
