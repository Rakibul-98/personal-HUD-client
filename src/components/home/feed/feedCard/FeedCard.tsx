"use client";

import React from "react";
import Link from "next/link";
import { Bookmark, ExternalLink, Hash, TrendingUp, Clock } from "lucide-react";
import { Feed as FeedType } from "../../../../Redux/slices/feedSlice";
import { useAppDispatch, useAppSelector } from "../../../../Redux/hooks";
import { addBookmark, removeBookmark } from "../../../../Redux/slices/bookmarkSlice";
import { logAnalyticsEvent } from "../../../../lib/analytics";
import { useTheme } from "../../../ThemeProvider/ThemeProvider";

interface FeedCardProps {
  feed: FeedType;
}

const isValidUrl = (url: string) => {
  try { new URL(url); return true; } catch { return false; }
};

const timeAgo = (dateStr?: string): string => {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

export default function FeedCard({ feed }: FeedCardProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const bookmarks = useAppSelector((state) => state.bookmark.bookmarks);
  const { isDarkMode } = useTheme();

  const isBookmarked = bookmarks.some((b) => b.feedItem?._id === feed?._id);

  const handleBookmark = () => {
    if (!user) return alert("Login to bookmark articles");
    if (isBookmarked) {
      const bookmark = bookmarks.find((b) => b.feedItem?._id === feed._id);
      if (bookmark) dispatch(removeBookmark(bookmark._id));
    } else {
      // No longer passing user.id — backend gets it from token
      dispatch(addBookmark(feed._id));
    }
  };

  const handleArticleClick = () => {
    logAnalyticsEvent({ eventType: "FEED_CLICK", targetId: feed._id });
  };

  const cardBg = isDarkMode
    ? "bg-white/5 hover:bg-white/10 border-white/5"
    : "bg-gray-500/10 hover:bg-gray-500/20 border-gray-200";

  return (
    <div className={`${cardBg} border backdrop-blur rounded-sm p-5 transition-all duration-300`}>
      {/* Title + external link */}
      <div className="mb-3">
        {isValidUrl(feed.content) ? (
          <Link
            href={feed.content}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start justify-between gap-3"
            onClick={handleArticleClick}
          >
            <h3 className="flex-1 text-base font-medium leading-snug group-hover:underline">
              {feed.title}
            </h3>
            <ExternalLink className="h-4 w-4 mt-0.5 shrink-0 opacity-40 group-hover:opacity-100 group-hover:text-blue-500 transition-opacity" />
          </Link>
        ) : (
          <div className="text-base font-medium opacity-70">{feed.title}</div>
        )}
      </div>

      {/* AI Summary */}
      {feed.summary && (
        <p className={`text-sm leading-relaxed mb-3 line-clamp-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          {feed.summary}
        </p>
      )}

      {/* Tags */}
      {feed.tags && feed.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {feed.tags.map((tag, i) => (
            <span
              key={i}
              className={`px-2 py-0.5 text-xs rounded-full ${isDarkMode
                  ? "bg-blue-500/15 text-blue-300"
                  : "bg-blue-100 text-blue-700"
                }`}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Meta row */}
      <div className={`flex items-center justify-between text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1 px-2 py-1 rounded ${isDarkMode ? "bg-white/5" : "bg-gray-500/10"}`}>
            <Hash className="h-3 w-3" />
            <span>{feed.source}</span>
          </div>
          <span className={`px-2 py-1 rounded capitalize ${isDarkMode ? "bg-white/5" : "bg-gray-500/10"}`}>
            {feed.category}
          </span>
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            <span>{feed.popularityScore?.toLocaleString()}</span>
          </div>
          {feed.createdAt && (
            <div className="hidden sm:flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{timeAgo(feed.createdAt)}</span>
            </div>
          )}
        </div>

        <button
          onClick={handleBookmark}
          title={isBookmarked ? "Remove bookmark" : "Save bookmark"}
          className={`p-1 rounded transition-colors ${isDarkMode ? "hover:bg-white/10" : "hover:bg-gray-200"
            }`}
        >
          <Bookmark
            className={`h-5 w-5 transition-all ${isBookmarked
                ? isDarkMode
                  ? "fill-white stroke-white"
                  : "fill-gray-800 stroke-gray-800"
                : "stroke-current"
              }`}
          />
        </button>
      </div>

      <div className="h-px bg-gradient-to-r from-blue-400/20 to-transparent mt-4" />
    </div>
  );
}
