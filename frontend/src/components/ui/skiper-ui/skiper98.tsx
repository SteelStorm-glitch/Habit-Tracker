"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface VerticalMenuItemProps {
  id?: string;
  label: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  isActive?: boolean;
  color?: string;
  badge?: string | number;
  onClick?: () => void;
  className?: string;
}

/**
 * Skiper98: Vertical Tooltip with Smooth Clip-Path Animation & Spring Physics
 */
export const VerticalTooltip: React.FC<{
  label: string;
  color?: string;
  badge?: string | number;
  children: React.ReactNode;
  className?: string;
}> = ({ label, color = "#a855f7", badge, children, className }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn("relative flex items-center", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{
              clipPath: "inset(0% 100% 0% 0% round 12px)",
              opacity: 0,
              x: -10,
              scale: 0.95,
            }}
            animate={{
              clipPath: "inset(0% 0% 0% 0% round 12px)",
              opacity: 1,
              x: 0,
              scale: 1,
            }}
            exit={{
              clipPath: "inset(0% 100% 0% 0% round 12px)",
              opacity: 0,
              x: -8,
              scale: 0.95,
            }}
            transition={{
              type: "spring",
              stiffness: 420,
              damping: 26,
              mass: 0.6,
            }}
            className="absolute left-full ml-3.5 z-50 pointer-events-none flex items-center"
          >
            {/* Tooltip Card */}
            <div className="relative flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#110e20]/95 backdrop-blur-xl border border-purple-500/30 text-xs font-semibold text-white shadow-[0_10px_30px_rgba(0,0,0,0.7)] whitespace-nowrap">
              {/* Little Arrow Notch */}
              <div className="absolute -left-1 top-1/2 -translate-y-1/2 size-2 rotate-45 bg-[#110e20] border-l border-b border-purple-500/30" />

              <span style={{ color }}>●</span>
              <span>{label}</span>

              {badge !== undefined && (
                <span className="ml-1 px-1.5 py-0.5 rounded-md bg-purple-500/20 text-[10px] font-mono text-purple-300 border border-purple-500/30">
                  {badge}
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * Skiper98: Animated Menu Item with spring hover scale & magnetic layout indicator
 */
export const VerticalMenuItem: React.FC<VerticalMenuItemProps> = ({
  id,
  label,
  icon: Icon,
  isActive = false,
  color = "#a855f7",
  badge,
  onClick,
  className,
}) => {
  return (
    <VerticalTooltip label={label} color={color} badge={badge}>
      <motion.button
        id={id}
        data-tab={id?.replace("navTab-", "")}
        onClick={onClick}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 450, damping: 24 }}
        className={cn(
          "relative size-10 rounded-xl flex items-center justify-center transition-colors cursor-pointer group select-none",
          isActive ? "text-white" : "text-zinc-400 hover:text-white",
          className
        )}
        aria-label={label}
      >
        {/* Active Pill Spring Indicator (Skiper98) */}
        {isActive && (
          <motion.div
            layoutId="verticalMenuPill"
            transition={{
              type: "spring",
              stiffness: 380,
              damping: 28,
            }}
            className="absolute inset-0 rounded-xl bg-white/10 border border-white/15 shadow-[0_0_20px_rgba(168,85,247,0.35)] -z-10"
            style={{
              boxShadow: `0 0 20px ${color}33, inset 0 1px 0 rgba(255,255,255,0.15)`,
            }}
          />
        )}

        {/* Active Side Pip */}
        {isActive && (
          <motion.div
            layoutId="verticalMenuPip"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full"
            style={{ backgroundColor: color }}
          />
        )}

        {/* Icon */}
        <Icon
          className="size-[18px] transition-colors relative z-10"
          style={{ color: isActive ? color : undefined }}
        />
      </motion.button>
    </VerticalTooltip>
  );
};

export default VerticalMenuItem;
