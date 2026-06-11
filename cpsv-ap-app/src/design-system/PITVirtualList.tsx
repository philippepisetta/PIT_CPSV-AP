// src/design-system/PITVirtualList.tsx
"use client";

import React, { useState, useRef, useEffect, UIEvent } from "react";

interface PITVirtualListProps<T> {
  items: T[];
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  maxHeight?: string;
}

export default function PITVirtualList<T>({
  items,
  itemHeight,
  renderItem,
  className = "",
  maxHeight = "60vh",
}: PITVirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(400); // Default fallback height

  useEffect(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.clientHeight);
      
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setContainerHeight(entry.contentRect.height || entry.target.clientHeight);
        }
      });
      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

  const totalHeight = items.length * itemHeight;

  // Add small buffer of 2 items above and below the viewport to prevent flickering when scrolling
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - 2);
  const endIndex = Math.min(
    items.length - 1,
    Math.floor((scrollTop + containerHeight) / itemHeight) + 2
  );

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  const visibleItems = [];
  for (let i = startIndex; i <= endIndex; i++) {
    visibleItems.push({
      item: items[i],
      index: i,
      top: i * itemHeight,
    });
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={className}
      style={{
        overflowY: "auto",
        position: "relative",
        maxHeight,
        width: "100%",
      }}
    >
      <div style={{ height: totalHeight, width: "100%", position: "relative" }}>
        {visibleItems.map(({ item, index, top }) => (
          <div
            key={index}
            style={{
              position: "absolute",
              top,
              left: 0,
              right: 0,
              height: itemHeight,
            }}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
}
