"use client";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../Redux/hooks";
import { fetchBookmarks } from "../../Redux/slices/bookmarkSlice";
import FeedCard from "../home/feed/feedCard/FeedCard";
import FeedCardSkeleton from "../home/feed/feedCard/FeedCardSkeleton";
import Image from "next/image";
import emptyImg from "../../assets/no-bookmark.svg";

export default function Bookmark() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { bookmarks, loading } = useAppSelector((state) => state.bookmark);

  useEffect(() => {
    if (user) dispatch(fetchBookmarks(user.id));
  }, [dispatch, user]);

  if (loading)
    return (
      <div className="px-3">
        <main className="space-y-3">
          {[...Array(3)].map((_, index) => (
            <FeedCardSkeleton key={index} />
          ))}
        </main>
      </div>
    );

  if (bookmarks.length === 0 && !loading)
    return (
      <div className="w-full max-w-sm mx-auto">
        <Image
          src={emptyImg}
          alt="No bookmarks illustration"
          className="object-contain"
        />
        <div className="rounded py-2 max-w-md w-full bg-white/10">
          <p className=" font-medium capitalize text-center">
            No bookmarks yet!
          </p>
        </div>
      </div>
    );

  return (
    <div
      className="h-full overflow-scroll"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <div className="px-3">
        <main className="space-y-3 h-[calc(100vh-4rem)] overflow-y-auto">
          {bookmarks.map((bookmark) =>
            bookmark.feedItem && bookmark.feedItem.content ? (
              <FeedCard key={bookmark._id} feed={bookmark.feedItem} />
            ) : null
          )}
        </main>
      </div>
    </div>
  );
}
