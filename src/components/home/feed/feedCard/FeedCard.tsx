import React from "react";
import Link from "next/link";
import { Bookmark, ExternalLink, Hash, TrendingUp } from "lucide-react";
import { Feed as FeedType } from "../../../../Redux/slices/feedSlice";
import { useAppDispatch, useAppSelector } from "../../../../Redux/hooks";
import {
  addBookmark,
  removeBookmark,
} from "../../../../Redux/slices/bookmarkSlice";
import { useTheme } from "../../../ThemeProvider/ThemeProvider";

interface FeedCardProps {
  feed: FeedType;
}

export default function FeedCard({ feed }: FeedCardProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const bookmarks = useAppSelector((state) => state.bookmark.bookmarks);
  const { isDarkMode } = useTheme();

  const isBookmarked = bookmarks.some((b) => b.feedItem._id === feed._id);

  const handleBookmark = () => {
    if (!user) return alert("Login to bookmark");
    if (isBookmarked) {
      const bookmark = bookmarks.find((b) => b.feedItem?._id === feed._id);
      if (bookmark) dispatch(removeBookmark(bookmark._id));
    } else {
      dispatch(addBookmark({ user: user.id, feedItem: feed._id }));
    }
  };

  return (
    <div
      className={`${
        isDarkMode
          ? "bg-white/5 hover:bg-white/10"
          : "bg-gray-500/10 hover:bg-gray-500/20"
      }  backdrop-blur rounded-sm p-6 transition-all duration-300`}
    >
      <div className="mb-4">
        <Link
          href={feed.content}
          target="_blank"
          rel="noopener noreferrer"
          className="group hover:underline flex items-start justify-between"
        >
          <h3 className="flex-1 text-lg font-medium mb-2 pr-5 leading-relaxed">
            {feed.title}
          </h3>
          <ExternalLink className=" h-5 w-5 group-hover:text-blue-500 mt-1" />
        </Link>
      </div>

      <div
        className={`flex items-center justify-between text-sm ${
          isDarkMode ? "text-gray-300" : "text-gray-800"
        } `}
      >
        <div className="flex items-center space-x-4">
          <div
            className={`flex items-center space-x-1 ${
              isDarkMode ? "bg-white/5" : "bg-gray-500/20"
            } px-2 py-1 rounded`}
          >
            <Hash className="h-3 w-3" />
            <span>{feed.source}</span>
          </div>
          <span
            className={`${
              isDarkMode ? "bg-white/5" : "bg-gray-500/20"
            } px-2 py-1 rounded capitalize`}
          >
            {feed.category}
          </span>

          <div className="flex items-center space-x-1">
            <TrendingUp className="h-3 w-3" />
            <span>{feed.popularityScore}</span>
          </div>
        </div>

        <button onClick={handleBookmark} className="cursor-pointer">
          <Bookmark
            className={`h-6 w-6 ${
              isBookmarked ? (isDarkMode ? "fill-white" : "fill-black") : ""
            }`}
          />
        </button>
      </div>

      <div className="h-px bg-gradient-to-r from-blue-400/30 to-transparent mt-4"></div>
    </div>
  );
}
