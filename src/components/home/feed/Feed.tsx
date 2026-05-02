/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import FeedMenu from "./feedMenu/FeedMenu";
import FeedCard from "./feedCard/FeedCard";
import { fetchFeeds, refreshAndFetchFeeds } from "../../../Redux/slices/feedSlice";
import FeedCardSkeleton from "./feedCard/FeedCardSkeleton";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks";
import Image from "next/image";
import errorImg from "../../../assets/error.svg";

export default function Feed() {
  const feedContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);

  const dispatch = useAppDispatch();
  const { feeds, loading, refreshing, error, userFocus, totalPages, page } = useAppSelector((s) => s.feed);
  const { settings } = useAppSelector((s) => s.settings);

  const cardsPerView = 3;
  const totalCards = feeds.length;

  useEffect(() => {
    dispatch(
      fetchFeeds({
        userFocus: { topics: userFocus },
        feedSources: settings?.feedSources ?? null,
        sortingPreference: settings?.sortingPreference,
      })
    );
  }, [dispatch, userFocus, settings?.feedSources, settings?.sortingPreference]);

  // Scroll the container when currentIndex changes
  useEffect(() => {
    if (feedContainerRef.current && totalCards > cardsPerView) {
      const card = feedContainerRef.current.children[0] as HTMLElement;
      if (card) {
        const cardHeight = card.offsetHeight + 12;
        feedContainerRef.current.scrollTo({ top: currentIndex * cardHeight, behavior: "smooth" });
      }
    }
  }, [currentIndex, totalCards]);

  const getIntervalMs = () => {
    const speed = Math.min(Math.max(Math.round(settings?.scrollSpeed ?? 2), 1), 3);
    return speed === 1 ? 4000 : speed === 2 ? 2000 : 1000;
  };

  useEffect(() => {
    if (totalCards <= cardsPerView || !isAutoScrollEnabled) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1 > totalCards - cardsPerView ? 0 : prev + 1));
    }, getIntervalMs());
    return () => clearInterval(interval);
  }, [totalCards, isAutoScrollEnabled, settings?.scrollSpeed]);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      if (isAutoScrollEnabled) return;
      if (e.deltaY > 0) {
        setCurrentIndex((prev) => (prev + 1 > totalCards - cardsPerView ? 0 : prev + 1));
      } else {
        setCurrentIndex((prev) => (prev - 1 < 0 ? totalCards - cardsPerView : prev - 1));
      }
    },
    [totalCards, isAutoScrollEnabled]
  );

  const handleFetchNow = () => {
    dispatch(
      refreshAndFetchFeeds({
        userFocus: { topics: userFocus },
        feedSources: settings?.feedSources,
        sortingPreference: settings?.sortingPreference,
      })
    );
  };

  // Error state
  if (error && !feeds.length) {
    return (
      <div className="px-3">
        <FeedMenu isAutoScroll={isAutoScrollEnabled} onAutoScrollToggle={() => setIsAutoScrollEnabled((p) => !p)} onFetchNow={handleFetchNow} refreshing={refreshing} />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] gap-4">
          <Image src={errorImg} alt="Error loading feed" className="w-40 object-contain opacity-60" />
          <p className="text-sm text-gray-500">{error}</p>
          <button
            onClick={() => dispatch(fetchFeeds({ userFocus: { topics: userFocus }, feedSources: settings?.feedSources }))}
            className="text-sm text-blue-500 hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // Loading skeleton
  if (loading) {
    return (
      <div className="px-3">
        <FeedMenu isAutoScroll={isAutoScrollEnabled} onAutoScrollToggle={() => setIsAutoScrollEnabled((p) => !p)} onFetchNow={handleFetchNow} refreshing={refreshing} />
        <main className="space-y-3 h-[calc(100vh-200px)]">
          {[...Array(4)].map((_, i) => <FeedCardSkeleton key={i} />)}
        </main>
      </div>
    );
  }

  // Empty state
  if (!feeds.length) {
    return (
      <div className="px-3">
        <FeedMenu isAutoScroll={isAutoScrollEnabled} onAutoScrollToggle={() => setIsAutoScrollEnabled((p) => !p)} onFetchNow={handleFetchNow} refreshing={refreshing} />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] gap-3 text-center">
          <p className="text-lg font-medium">Your feed is empty</p>
          <p className="text-sm text-gray-500 max-w-xs">
            Add focus topics in the sidebar, or click <strong>Fetch Now</strong> to pull in the latest articles.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-3 h-full">
      <FeedMenu
        isAutoScroll={isAutoScrollEnabled}
        onAutoScrollToggle={() => setIsAutoScrollEnabled((p) => !p)}
        onFetchNow={handleFetchNow}
        refreshing={refreshing}
        totalItems={feeds.length}
        page={page}
        totalPages={totalPages}
      />
      <main
        ref={feedContainerRef}
        className="space-y-3 h-[calc(100vh-9rem)] overflow-y-auto"
        onWheel={handleWheel}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {feeds.map((feed) => <FeedCard key={feed._id} feed={feed} />)}
      </main>
    </div>
  );
}
