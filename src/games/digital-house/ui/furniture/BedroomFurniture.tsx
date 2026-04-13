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

export function BedroomFurniture() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Bed frame */}
      <div
        style={{
          position: "absolute",
          top: 18,
          left: "50%",
          transform: "translateX(-50%)",
          width: 94,
          height: 58,
          background: "linear-gradient(180deg,#6b5744,#5d4a38)",
          borderRadius: 5,
          boxShadow:
            "0 3px 0 #4a3c30, 0 6px 10px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        {/* Sheet */}
        <div
          style={{
            position: "absolute",
            top: 3,
            left: 3,
            right: 3,
            bottom: 3,
            background:
              "linear-gradient(180deg,#ece4d2 0%,#dfd5be 100%)",
            borderRadius: 3,
            boxShadow: "inset 0 1px 2px rgba(255,255,255,0.35)",
          }}
        />
        {/* Blanket */}
        <div
          style={{
            position: "absolute",
            top: 18,
            left: 3,
            right: 3,
            bottom: 3,
            background:
              "linear-gradient(180deg,#8697b0 0%,#6e8099 50%,#596a82 100%)",
            borderRadius: "0 0 3px 3px",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.2), 0 -1px 0 rgba(0,0,0,0.2)",
          }}
        />
        {/* Pillows */}
        <div
          style={{
            position: "absolute",
            top: 5,
            left: 8,
            width: 30,
            height: 9,
            background:
              "radial-gradient(ellipse at 50% 35%,#fefaf0 0%,#efe8d6 100%)",
            borderRadius: 5,
            boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 5,
            right: 8,
            width: 30,
            height: 9,
            background:
              "radial-gradient(ellipse at 50% 35%,#fefaf0 0%,#efe8d6 100%)",
            borderRadius: 5,
            boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
          }}
        />
      </div>

      {/* Nightstand */}
      <div
        style={{
          position: "absolute",
          top: 34,
          right: 16,
          width: 20,
          height: 22,
          background: "linear-gradient(180deg,#6b5744,#5d4a38)",
          borderRadius: 3,
          boxShadow:
            "0 2px 0 #4a3c30, 0 3px 5px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 8,
            left: 2,
            right: 2,
            height: 1,
            background: "#4a3c30",
          }}
        />
      </div>
      {/* Lamp base + warm glow */}
      <div
        style={{
          position: "absolute",
          top: 24,
          right: 22,
          width: 8,
          height: 12,
          background: "linear-gradient(180deg,#fef3c7,#fbd979)",
          borderRadius: "50% 50% 2px 2px",
          boxShadow:
            "0 0 18px rgba(254,243,199,0.55), 0 1px 2px rgba(0,0,0,0.2)",
        }}
      />

      {/* Dresser */}
      <div
        style={{
          position: "absolute",
          top: 16,
          left: 14,
          width: 28,
          height: 22,
          background: "linear-gradient(180deg,#6b5744,#5d4a38)",
          borderRadius: 2,
          boxShadow:
            "0 2px 0 #4a3c30, 0 3px 5px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        {[6, 12, 18].map((t) => (
          <div
            key={t}
            style={{
              position: "absolute",
              top: t,
              left: 2,
              right: 2,
              height: 1,
              background: "#4a3c30",
              opacity: 0.75,
            }}
          />
        ))}
      </div>
    </div>
  );
}
