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

export function EntryFurniture() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* House number */}
      <div
        style={{
          position: "absolute",
          top: 6,
          left: 12,
          fontSize: 11,
          fontWeight: 800,
          color: "#3d322a",
          opacity: 0.4,
          fontFamily: "ui-monospace, monospace",
          letterSpacing: "0.08em",
        }}
      >
        42
      </div>

      {/* Front door frame */}
      <div
        style={{
          position: "absolute",
          top: 8,
          left: "50%",
          transform: "translateX(-50%)",
          width: 34,
          height: 48,
          border: "3px solid #5d4a38",
          borderRadius: "4px 4px 0 0",
          boxShadow:
            "0 3px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        {/* Door panel */}
        <div
          style={{
            position: "absolute",
            inset: 2,
            background:
              "linear-gradient(180deg,#6b5744 0%,#5d4a38 60%,#4a3c30 100%)",
            borderRadius: "2px 2px 0 0",
          }}
        >
          {/* Glass inset top */}
          <div
            style={{
              position: "absolute",
              top: 4,
              left: "50%",
              transform: "translateX(-50%)",
              width: 16,
              height: 12,
              background:
                "linear-gradient(135deg,rgba(56,189,248,0.2) 0%,rgba(56,189,248,0.08) 100%)",
              borderRadius: 2,
              border: "1px solid rgba(107,87,68,0.55)",
              boxShadow: "inset 0 1px 2px rgba(255,255,255,0.3)",
            }}
          />
          {/* Door knob */}
          <div
            style={{
              position: "absolute",
              top: "55%",
              right: 4,
              width: 4,
              height: 4,
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 35% 30%,#f0d97e 0%,#b58a2f 100%)",
              boxShadow: "0 1px 1px rgba(0,0,0,0.35)",
            }}
          />
        </div>
      </div>

      {/* Doorbell */}
      <div
        style={{
          position: "absolute",
          top: 24,
          left: "calc(50% + 24px)",
          width: 6,
          height: 10,
          background: "linear-gradient(180deg,#d1d5db,#9ca3af)",
          borderRadius: 3,
          boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 3,
            left: "50%",
            transform: "translateX(-50%)",
            width: 3,
            height: 3,
            borderRadius: "50%",
            background: "#38bdf8",
            boxShadow: "0 0 6px #38bdf8",
          }}
        />
      </div>

      {/* Welcome mat */}
      <div
        style={{
          position: "absolute",
          bottom: 10,
          left: "50%",
          transform: "translateX(-50%)",
          width: 46,
          height: 11,
          background:
            "repeating-linear-gradient(90deg,#8f867b 0 3px,#6b6258 3px 5px)",
          borderRadius: 2,
          boxShadow:
            "0 1px 2px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.18)",
        }}
      />

      {/* Potted plant — left */}
      <div style={{ position: "absolute", bottom: 6, left: 14 }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            width: 12,
            height: 8,
            background: "linear-gradient(180deg,#8c7c6c,#6e5f51)",
            borderRadius: "1px 1px 3px 3px",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -9,
            left: 1,
            width: 10,
            height: 10,
            background:
              "radial-gradient(circle at 30% 30%,#6a9e6a 0%,#3e6b3e 100%)",
            borderRadius: "50%",
            boxShadow: "0 1px 2px rgba(0,0,0,0.25)",
          }}
        />
      </div>
      {/* Potted plant — right */}
      <div style={{ position: "absolute", bottom: 6, right: 14 }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            width: 12,
            height: 8,
            background: "linear-gradient(180deg,#8c7c6c,#6e5f51)",
            borderRadius: "1px 1px 3px 3px",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -9,
            left: 1,
            width: 10,
            height: 10,
            background:
              "radial-gradient(circle at 30% 30%,#6a9e6a 0%,#3e6b3e 100%)",
            borderRadius: "50%",
            boxShadow: "0 1px 2px rgba(0,0,0,0.25)",
          }}
        />
      </div>
    </div>
  );
}
