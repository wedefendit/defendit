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

export function LivingRoomFurniture() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Couch base */}
      <div
        style={{
          position: "absolute",
          top: 12,
          left: 14,
          width: 100,
          height: 32,
          background: "linear-gradient(180deg,#8a7564,#6c5a4a)",
          borderRadius: 8,
          boxShadow:
            "0 3px 0 #4a3c30, 0 5px 10px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        {[5, 36, 67].map((l) => (
          <div
            key={l}
            style={{
              position: "absolute",
              top: 4,
              left: l,
              width: 28,
              height: 18,
              background:
                "linear-gradient(180deg,#a08a75 0%,#8b7865 100%)",
              borderRadius: 5,
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.2), 0 1px 2px rgba(0,0,0,0.2)",
            }}
          />
        ))}
      </div>

      {/* Coffee table */}
      <div
        style={{
          position: "absolute",
          top: 50,
          left: 30,
          width: 56,
          height: 14,
          background: "linear-gradient(180deg,#7a6450,#5d4a38)",
          borderRadius: 3,
          boxShadow:
            "0 2px 0 #4a3c30, 0 3px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
        }}
      />
      {/* Magazine on coffee table */}
      <div
        style={{
          position: "absolute",
          top: 54,
          left: 58,
          width: 16,
          height: 6,
          background: "#c9b886",
          borderRadius: 1,
          opacity: 0.75,
        }}
      />

      {/* TV stand */}
      <div
        style={{
          position: "absolute",
          top: 14,
          right: 14,
          width: 30,
          height: 14,
          background: "linear-gradient(180deg,#5d4a38,#4a3c30)",
          borderRadius: 2,
          boxShadow: "0 2px 0 #3d3226, 0 3px 5px rgba(0,0,0,0.3)",
        }}
      />
      {/* TV */}
      <div
        style={{
          position: "absolute",
          top: 4,
          right: 15,
          width: 28,
          height: 18,
          background: "#0f172a",
          borderRadius: 2,
          border: "2px solid #1e293b",
          boxShadow:
            "0 2px 4px rgba(0,0,0,0.4), inset 0 0 10px rgba(56,189,248,0.2)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 1,
            background:
              "linear-gradient(135deg,#1e3a5f 0%,#244868 50%,#1a3050 100%)",
            borderRadius: 1,
          }}
        />
      </div>

      {/* Floor lamp (pole + shade + glow) */}
      <div
        style={{
          position: "absolute",
          bottom: 14,
          left: 18,
          width: 3,
          height: 36,
          background: "#6b7280",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 46,
          left: 12,
          width: 16,
          height: 12,
          background:
            "linear-gradient(180deg,#d4a84b 0%,#b88838 100%)",
          borderRadius: "8px 8px 2px 2px",
          boxShadow:
            "0 0 18px rgba(212,168,75,0.55), inset 0 1px 0 rgba(255,255,255,0.2)",
        }}
      />
      {/* Lamp light pool */}
      <div
        style={{
          position: "absolute",
          bottom: 8,
          left: 10,
          width: 22,
          height: 8,
          background:
            "radial-gradient(ellipse at center,rgba(254,243,199,0.3),transparent 70%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
