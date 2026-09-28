"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import React, {
  type ComponentPropsWithoutRef,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

export type SmoothInputProps = ComponentPropsWithoutRef<"input"> & {
  wrapperClassName?: string;
  caretClassName?: string;
};

const PASSWORD_CHAR =
  typeof navigator !== "undefined" && navigator.userAgent.match(/firefox|fxios/i)
    ? "\u25CF"
    : "\u2022";

export const SmoothInput = React.forwardRef<HTMLInputElement, SmoothInputProps>(
  (
    {
      className,
      wrapperClassName,
      caretClassName,
      value,
      defaultValue,
      onChange,
      onFocus,
      onBlur,
      type = "text",
      placeholder,
      style,
      disabled,
      ...props
    },
    forwardedRef
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue ?? "");
    const [isFocused, setIsFocused] = useState(false);
    const caretX = useMotionValue(0);
    const caretOpacity = useMotionValue(0);

    const containerRef = useRef<HTMLDivElement>(null);
    const localInputRef = useRef<HTMLInputElement>(null);
    const measureRef = useRef<HTMLSpanElement>(null);
    const prefersReducedMotion = useReducedMotion();

    const isControlled = value !== undefined;
    const inputValue = isControlled ? String(value ?? "") : String(internalValue ?? "");

    // Connect forwardedRef and localInputRef
    const setRefs = (node: HTMLInputElement | null) => {
      localInputRef.current = node;
      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    };

    const springCaretX = useSpring(
      caretX,
      prefersReducedMotion
        ? { stiffness: 10000, damping: 100, mass: 0.1 }
        : { stiffness: 500, damping: 32, mass: 0.45 }
    );

    const syncMeasureSpan = () => {
      const input = localInputRef.current;
      const measureSpan = measureRef.current;
      if (!input || !measureSpan) return;

      const styles = window.getComputedStyle(input);
      const isPassword = input.type === "password";

      let fontSize = styles.fontSize;
      if (
        PASSWORD_CHAR === "\u2022" &&
        isPassword &&
        typeof navigator !== "undefined" &&
        !navigator.userAgent.match(/chrome|chromium|crios/i)
      ) {
        fontSize = `${parseFloat(fontSize) + 6.25}px`;
      }

      measureSpan.style.font = `${styles.fontStyle} ${styles.fontWeight} ${fontSize} ${styles.fontFamily}`;
      measureSpan.style.letterSpacing = styles.letterSpacing;
      measureSpan.style.fontFeatureSettings = styles.fontFeatureSettings;
      measureSpan.style.fontVariationSettings = styles.fontVariationSettings;
    };

    const measurePrefixWidth = (text: string) => {
      const input = localInputRef.current;
      const measureSpan = measureRef.current;
      if (!input || !measureSpan) return null;

      syncMeasureSpan();
      measureSpan.textContent = text;

      const paddingLeft =
        parseFloat(window.getComputedStyle(input).paddingLeft) || 0;

      return text.length > 0
        ? measureSpan.offsetWidth + paddingLeft
        : paddingLeft;
    };

    const scrollCaretIntoView = (
      target: HTMLInputElement,
      absoluteWidth: number
    ) => {
      const styles = window.getComputedStyle(target);
      const paddingLeft = parseFloat(styles.paddingLeft) || 0;
      const paddingRight = parseFloat(styles.paddingRight) || 0;
      const maxScroll = Math.max(0, target.scrollWidth - target.clientWidth);
      const visibleRight = target.scrollLeft + target.clientWidth - paddingRight;
      const visibleLeft = target.scrollLeft + paddingLeft;

      if (absoluteWidth > visibleRight) {
        target.scrollLeft = Math.min(
          absoluteWidth - target.clientWidth + paddingRight,
          maxScroll
        );
        return;
      }

      if (absoluteWidth < visibleLeft) {
        target.scrollLeft = Math.max(0, absoluteWidth - paddingLeft);
      }
    };

    const getCaretIndex = (target: HTMLInputElement) => {
      try {
        const selectionStart = target.selectionStart ?? 0;
        const selectionEnd = target.selectionEnd ?? 0;

        if (selectionStart === selectionEnd) {
          return selectionStart;
        }

        return target.selectionDirection === "backward"
          ? selectionStart
          : selectionEnd;
      } catch {
        // type="number" or inputs that don't support selectionStart
        return target.value ? target.value.length : 0;
      }
    };

    const updateCaretFromInput = (target: HTMLInputElement) => {
      if (document.activeElement !== target) {
        caretOpacity.set(0);
        return;
      }

      let hasSelection = false;
      try {
        hasSelection = (target.selectionStart ?? 0) !== (target.selectionEnd ?? 0);
      } catch {
        hasSelection = false;
      }

      const caretIndex = getCaretIndex(target);
      const isPassword = target.type === "password";
      const textBeforeCaret = isPassword
        ? PASSWORD_CHAR.repeat(caretIndex)
        : target.value.slice(0, caretIndex);

      const absoluteWidth = measurePrefixWidth(textBeforeCaret);
      if (absoluteWidth === null) return;

      scrollCaretIntoView(target, absoluteWidth);

      const styles = window.getComputedStyle(target);
      const paddingLeft = parseFloat(styles.paddingLeft) || 0;
      const paddingRight = parseFloat(styles.paddingRight) || 0;
      const caretPosition = absoluteWidth - target.scrollLeft;
      const minX = paddingLeft;
      const maxX = target.clientWidth - paddingRight;
      const isCaretVisible =
        caretPosition >= minX - 2 && caretPosition <= maxX + 2;

      caretX.set(Math.min(Math.max(caretPosition, minX), maxX));

      if (!isCaretVisible || hasSelection) {
        caretOpacity.set(0);
        return;
      }

      caretOpacity.set(1);
    };

    const updateCaretRef = useRef(updateCaretFromInput);
    updateCaretRef.current = updateCaretFromInput;

    useEffect(() => {
      const input = localInputRef.current;
      if (input && document.activeElement === input) {
        updateCaretRef.current(input);
      }
    }, [inputValue]);

    useEffect(() => {
      const input = localInputRef.current;
      const container = containerRef.current;
      if (!input || !container) return;

      const updateCaretIfFocused = () => {
        if (document.activeElement === input) {
          updateCaretRef.current(input);
        }
      };

      const handleSelectionChange = () => {
        if (document.activeElement !== input) return;
        requestAnimationFrame(updateCaretIfFocused);
      };

      document.addEventListener("selectionchange", handleSelectionChange);
      if (typeof document.fonts !== "undefined") {
        document.fonts.addEventListener("loadingdone", updateCaretIfFocused);
        void document.fonts.ready.then(updateCaretIfFocused);
      }
      input.addEventListener("scroll", updateCaretIfFocused);

      const resizeObserver = new ResizeObserver(updateCaretIfFocused);
      resizeObserver.observe(container);

      return () => {
        document.removeEventListener("selectionchange", handleSelectionChange);
        if (typeof document.fonts !== "undefined") {
          document.fonts.removeEventListener("loadingdone", updateCaretIfFocused);
        }
        input.removeEventListener("scroll", updateCaretIfFocused);
        resizeObserver.disconnect();
      };
    }, []);

    return (
      <div
        ref={containerRef}
        className={cn("relative grid grid-cols-1 w-full p-0", wrapperClassName)}
        style={{ caretColor: "transparent" }}
      >
        <input
          {...props}
          ref={setRefs}
          type={type}
          disabled={disabled}
          placeholder={placeholder}
          value={inputValue}
          style={style}
          className={cn(
            "col-start-1 col-end-2 row-start-1 row-end-2 w-full bg-transparent outline-none transition-all placeholder:text-zinc-500",
            className
          )}
          onChange={(e) => {
            if (!isControlled) setInternalValue(e.target.value);
            onChange?.(e);
            requestAnimationFrame(() => {
              if (localInputRef.current) {
                updateCaretRef.current(localInputRef.current);
              }
            });
          }}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
            const target = e.currentTarget;
            requestAnimationFrame(() => {
              updateCaretRef.current(target);
            });
          }}
          onBlur={(e) => {
            setIsFocused(false);
            caretOpacity.set(0);
            onBlur?.(e);
          }}
        />

        {/* Hidden measurement element to accurately gauge character width */}
        <span
          ref={measureRef}
          aria-hidden
          className="pointer-events-none invisible absolute top-0 left-0 whitespace-pre"
        />

        {/* Smooth spring animated Caret */}
        {isFocused && !disabled && (
          <motion.div
            aria-hidden="true"
            className={cn(
              "pointer-events-none col-start-1 col-end-2 row-start-1 row-end-2 h-[1.15em] w-[2px] self-center rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.85)]",
              caretClassName
            )}
            style={{ x: springCaretX, opacity: caretOpacity }}
          />
        )}
      </div>
    );
  }
);

SmoothInput.displayName = "SmoothInput";

export default SmoothInput;
