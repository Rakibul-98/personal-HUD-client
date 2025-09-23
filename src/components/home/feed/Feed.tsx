"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import FeedMenu from "./feedMenu/FeedMenu";
import FeedCard from "./feedCard/FeedCard";

export default function Feed() {
  const feedContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);
  const cardsPerView = 3;
  const totalCards = 10;

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

  useEffect(() => {
    if (totalCards <= cardsPerView || !isAutoScrollEnabled) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        if (nextIndex > totalCards - cardsPerView) {
          return 0;
        }
        return nextIndex;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [totalCards, isAutoScrollEnabled]);

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

  const handleFetchNow = () => {
    console.log("Fetch Now clicked");
    setCurrentIndex(0);
  };

  if (totalCards <= cardsPerView) {
    return (
      <div className="p-5">
        <div className="">
          <FeedMenu
            isAutoScroll={isAutoScrollEnabled}
            onAutoScrollToggle={handleAutoScrollToggle}
            onFetchNow={handleFetchNow}
          />
          <main className="space-y-3 h-[calc(100vh-200px)]">
            {[...Array(totalCards)].map((_, index) => (
              <FeedCard key={index} />
            ))}
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5">
      <div className="">
        <FeedMenu
          isAutoScroll={isAutoScrollEnabled}
          onAutoScrollToggle={handleAutoScrollToggle}
          onFetchNow={handleFetchNow}
        />
        <main
          ref={feedContainerRef}
          className="space-y-3 h-[calc(100vh-200px)] overflow-y-auto"
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

          {[...Array(totalCards)].map((_, index) => (
            <FeedCard key={index} />
          ))}
        </main>
      </div>
    </div>
  );
}
