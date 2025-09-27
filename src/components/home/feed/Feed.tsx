/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import FeedMenu from "./feedMenu/FeedMenu";
import FeedCard from "./feedCard/FeedCard";
import {
  fetchFeeds,
  refreshAndFetchFeeds,
} from "../../../Redux/slices/feedSlice";
import FeedCardSkeleton from "./feedCard/FeedCardSkeleton";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks";

interface FeedProps {
  userId?: string;
}

export default function Feed({ userId }: FeedProps) {
  const feedContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);

  const dispatch = useAppDispatch();
  const { feeds, loading, error, userFocus } = useAppSelector(
    (state) => state.feed
  );
  const { settings } = useAppSelector((state) => state.settings);

  const cardsPerView = 3;
  const totalCards = feeds.length;

  useEffect(() => {
    dispatch(
      fetchFeeds({
        userFocus: { topics: userFocus },
        userId,
        feedSources: settings?.feedSources ?? null,
        sortingPreference: settings?.sortingPreference,
      })
    );
  }, [
    dispatch,
    userFocus,
    userId,
    settings?.feedSources,
    settings?.sortingPreference,
  ]);

  useEffect(() => {
    if (feedContainerRef.current && totalCards > cardsPerView) {
      const cardElement = feedContainerRef.current.children[0] as HTMLElement;
      if (cardElement) {
        const cardHeight = cardElement.offsetHeight + 12;
        feedContainerRef.current.scrollTo({
          top: currentIndex * cardHeight,
          behavior: "smooth",
        });
      }
    }
  }, [currentIndex, totalCards]);

  const getIntervalMs = () => {
    const raw = settings?.scrollSpeed ?? 2;
    const speed = Math.min(Math.max(Math.round(raw), 1), 3);
    if (speed === 1) return 4000;
    if (speed === 2) return 2000;
    return 1000;
  };

  useEffect(() => {
    if (totalCards <= cardsPerView || !isAutoScrollEnabled) return;

    const intervalMs = getIntervalMs();

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        if (nextIndex > totalCards - cardsPerView) {
          return 0;
        }
        return nextIndex;
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [totalCards, isAutoScrollEnabled, settings?.scrollSpeed]);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (isAutoScrollEnabled) {
        e.preventDefault();
        return;
      }

      e.preventDefault();

      if (e.deltaY > 0) {
        setCurrentIndex((prevIndex) => {
          const nextIndex = prevIndex + 1;
          return nextIndex > totalCards - cardsPerView ? 0 : nextIndex;
        });
      } else {
        setCurrentIndex((prevIndex) => {
          const prevIndexNew = prevIndex - 1;
          return prevIndexNew < 0 ? totalCards - cardsPerView : prevIndexNew;
        });
      }
    },
    [totalCards, isAutoScrollEnabled]
  );

  const handleAutoScrollToggle = () => {
    setIsAutoScrollEnabled((prev) => !prev);
  };

  const handleFetchNow = () =>
    dispatch(
      refreshAndFetchFeeds({
        userFocus: { topics: userFocus },
        userId,
        feedSources: settings?.feedSources,
      })
    );

  if (loading) {
    return (
      <div className="px-3">
        <FeedMenu
          isAutoScroll={isAutoScrollEnabled}
          onAutoScrollToggle={handleAutoScrollToggle}
          onFetchNow={handleFetchNow}
        />
        <main className="space-y-3 h-[calc(100vh-200px)]">
          {[...Array(3)].map((_, index) => (
            <FeedCardSkeleton key={index} />
          ))}
        </main>
      </div>
    );
  }
  if (error)
    return (
      <div className="min-h-full flex items-center justify-center p-4 ">
        <div className="rounded p-6 max-w-md w-full bg-white/10">
          <p className="text-red-500 font-medium text-center">{error}</p>
        </div>
      </div>
    );

  if (totalCards <= cardsPerView) {
    return (
      <div className="px-3">
        <FeedMenu
          isAutoScroll={isAutoScrollEnabled}
          onAutoScrollToggle={handleAutoScrollToggle}
          onFetchNow={handleFetchNow}
        />
        <main className="space-y-3 h-[calc(100vh-200px)]">
          {feeds.map((feed) => (
            <FeedCard key={feed._id} feed={feed} />
          ))}
        </main>
      </div>
    );
  }

  return (
    <div className="px-3 h-full">
      <FeedMenu
        isAutoScroll={isAutoScrollEnabled}
        onAutoScrollToggle={handleAutoScrollToggle}
        onFetchNow={handleFetchNow}
      />
      <main
        ref={feedContainerRef}
        className="space-y-3 h-[calc(100vh-9rem)] overflow-y-auto"
        onWheel={handleWheel}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style jsx>{`
          main::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {feeds.map((feed) => (
          <FeedCard key={feed._id} feed={feed} />
        ))}
      </main>
    </div>
  );
}
