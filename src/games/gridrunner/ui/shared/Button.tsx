/*
Copyright © 2026 Defend I.T. Solutions LLC. All Rights Reserved.
*/

"use client";

import type { ReactNode } from "react";

export type ButtonVariant = "primary" | "warning" | "danger" | "neutral";

type ButtonProps = Readonly<{
  variant: ButtonVariant;
  onClick: () => void;
  children: ReactNode;
  disabled?: boolean;
  type?: "button" | "submit";
  testId?: string;
  ariaLabel?: string;
  className?: string;
}>;

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "border-[#00f0ff] bg-[#0f1b2d] text-[#00f0ff]",
  warning: "border-[#ff6b00] bg-[#0f1b2d] text-[#ff6b00]",
  danger: "border-[#ff003c] bg-[#1a0a10] text-[#ff003c]",
  neutral: "border-[#1a3a4a] bg-[#0f1b2d] text-[#aabbcc]",
};

const BASE =
  "gr-font-mono rounded-sm border min-h-[44px] px-3 py-2 text-xs font-bold tracking-widest active:brightness-150 disabled:opacity-50";

export function Button({
  variant,
  onClick,
  children,
  disabled = false,
  type = "button",
  testId,
  ariaLabel,
  className = "",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      data-testid={testId}
      aria-label={ariaLabel}
      className={`${BASE} ${VARIANT_CLASSES[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
