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

export function KitchenFurniture() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Counter top */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          width: 108,
          height: 16,
          background:
            "linear-gradient(180deg,#eaeef2 0%,#d8dde4 50%,#c0c6d0 100%)",
          borderRadius: 2,
          boxShadow:
            "0 2px 0 #8a9099, 0 3px 5px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.4)",
        }}
      />
      {/* Counter cabinet base */}
      <div
        style={{
          position: "absolute",
          top: 26,
          left: 10,
          width: 108,
          height: 12,
          background: "linear-gradient(180deg,#5d4a38,#4a3c30)",
          borderRadius: "0 0 2px 2px",
          boxShadow:
            "0 2px 0 #3d3226, inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      />
      {/* Cabinet door lines */}
      <div
        style={{
          position: "absolute",
          top: 26,
          left: 36,
          width: 1,
          height: 12,
          background: "#3a2f24",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 26,
          left: 94,
          width: 1,
          height: 12,
          background: "#3a2f24",
        }}
      />

      {/* Stove */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 54,
          width: 24,
          height: 16,
          background:
            "linear-gradient(180deg,#b8bdc4,#868d96)",
          borderRadius: 2,
          boxShadow:
            "0 1px 3px rgba(0,0,0,0.3), inset 0 0 0 1px #5a6068",
        }}
      >
        {[
          [3, 3],
          [3, 13],
          [10, 3],
          [10, 13],
        ].map(([t, l]) => (
          <div
            key={`${t}-${l}`}
            style={{
              position: "absolute",
              top: t,
              left: l,
              width: 5,
              height: 5,
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 35% 30%,#3a3f48 0%,#1a1f28 80%)",
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)",
            }}
          />
        ))}
      </div>

      {/* Fridge */}
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 16,
          width: 22,
          height: 54,
          background:
            "linear-gradient(180deg,#eef0f3 0%,#dfe2e6 50%,#bdc2c8 100%)",
          borderRadius: 3,
          boxShadow:
            "0 3px 0 #8a9099, 0 4px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.5)",
        }}
      >
        {/* Freezer/fridge divider */}
        <div
          style={{
            position: "absolute",
            top: "38%",
            left: 1,
            right: 1,
            height: 1,
            background: "#9ea4ac",
          }}
        />
        {/* Handle */}
        <div
          style={{
            position: "absolute",
            top: 8,
            right: 3,
            width: 2,
            height: 14,
            background: "#6b7280",
            borderRadius: 1,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 28,
            right: 3,
            width: 2,
            height: 18,
            background: "#6b7280",
            borderRadius: 1,
          }}
        />
      </div>

      {/* Sink */}
      <div
        style={{
          position: "absolute",
          top: 12,
          left: 24,
          width: 20,
          height: 12,
          background:
            "linear-gradient(180deg,#94a3b8,#64748b)",
          borderRadius: 2,
          boxShadow: "inset 0 1px 2px rgba(0,0,0,0.3)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 2,
            left: "50%",
            width: 1,
            marginLeft: -0.5,
            height: 2,
            background: "#cbd5e1",
          }}
        />
      </div>
    </div>
  );
}
