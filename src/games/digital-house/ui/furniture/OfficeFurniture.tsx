/*
Copyright © 2025 Defend I.T. Solutions LLC. All Rights Reserved.

This software and its source code are the proprietary property of
Defend I.T. Solutions LLC and are protected by United States and
international copyright laws. Unauthorized reproduction, distribution,
modification, display, or use of this software, in whole or in part, without the
prior written permission of Defend I.T. Solutions LLC, is strictly prohibited.

This software is provided for use only by authorized employees, contractors, or
licensees of Defend I.T. Solutions LLC and may not be disclosed to any third
party without express written consent.
*/

export function OfficeFurniture() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Desk */}
      <div
        style={{
          position: "absolute",
          top: 14,
          left: 16,
          width: 100,
          height: 30,
          background: "linear-gradient(180deg,#7a6450 0%,#6b5744 60%,#5d4a38 100%)",
          borderRadius: 3,
          boxShadow:
            "0 3px 0 #4a3c30, 0 6px 10px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.12)",
        }}
      />
      {/* Desk drawer line */}
      <div
        style={{
          position: "absolute",
          top: 30,
          left: 72,
          width: 30,
          height: 2,
          background: "#4a3c30",
          opacity: 0.6,
        }}
      />
      {/* Monitor stand */}
      <div
        style={{
          position: "absolute",
          top: 25,
          left: 52,
          width: 12,
          height: 6,
          background: "#3a4050",
          borderRadius: 1,
          boxShadow: "0 1px 0 rgba(0,0,0,0.35)",
        }}
      />
      {/* Monitor */}
      <div
        style={{
          position: "absolute",
          top: 6,
          left: 44,
          width: 28,
          height: 22,
          background: "#0f1520",
          borderRadius: 3,
          border: "2px solid #2b3448",
          boxShadow:
            "0 2px 4px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(255,255,255,0.04)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 2,
            background:
              "linear-gradient(135deg,#1e3a5f 0%,#24496f 50%,#1a3150 100%)",
            borderRadius: 1,
            boxShadow: "inset 0 0 10px rgba(56,189,248,0.25)",
          }}
        />
        {/* Webcam dot */}
        <div
          style={{
            position: "absolute",
            top: -1,
            left: "50%",
            width: 2,
            height: 2,
            marginLeft: -1,
            borderRadius: "50%",
            background: "#94a3b8",
          }}
        />
      </div>
      {/* Chair (top-down, swivel) */}
      <div
        style={{
          position: "absolute",
          top: 50,
          left: 50,
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: "radial-gradient(circle at 35% 30%,#475569 0%,#334155 55%,#1e293b 100%)",
          boxShadow: "0 2px 4px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 64,
          left: 60,
          width: 2,
          height: 6,
          background: "#1f2937",
          borderRadius: 1,
        }}
      />
      {/* Bookshelf */}
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 16,
          width: 22,
          height: 52,
          background: "linear-gradient(90deg,#5d4e37,#4a3c30)",
          borderRadius: 3,
          boxShadow:
            "inset 0 0 0 2px #3d322a, 0 2px 6px rgba(0,0,0,0.35), inset 0 2px 0 rgba(255,255,255,0.08)",
        }}
      >
        {[
          { top: 5, color: "#c87058" },
          { top: 15, color: "#5b8a72" },
          { top: 25, color: "#4a6a8a" },
          { top: 35, color: "#d4a84b" },
        ].map((shelf) => (
          <div
            key={shelf.top}
            style={{
              position: "absolute",
              top: shelf.top,
              left: 3,
              right: 3,
              height: 6,
              borderRadius: 1,
              background: shelf.color,
              boxShadow: "0 1px 0 rgba(0,0,0,0.35)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
