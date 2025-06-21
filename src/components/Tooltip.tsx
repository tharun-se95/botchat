"use client";

import React, { useState } from "react";

type TooltipProps = {
  content: string;
  children: React.ReactElement;
  position?: "top" | "bottom" | "left" | "right";
};

export function Tooltip({
  children,
  content,
  position = "right",
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={`absolute whitespace-nowrap rounded-md bg-surface px-3 py-1.5 text-sm text-primaryText z-50 ${positionClasses[position]}`}
        >
          {content}
        </div>
      )}
    </div>
  );
}
