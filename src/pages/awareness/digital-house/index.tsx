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

import { Meta } from "@/components";
import { GameShell } from "@/games/shared/GameShell";
import { DigitalHouse } from "@/games/digital-house/DigitalHouse";

export default function DigitalHousePage() {
  const canonical = "https://www.wedefendit.com/awareness/digital-house";

  return (
    <>
      <Meta
        title="The Digital House | Defend I.T. Solutions"
        description="Build a home network layout and see how everyday device decisions affect privacy, exposure, and recovery. An interactive simulator from Defend I.T. Solutions."
        url={canonical}
        canonical={canonical}
      />
      {/*
        Full-viewport game — bypasses PageContainer because the normal
        centered content flow fights the h-[100dvh] grid. GameShell in
        "headless" mode only provides context + the badge dialog; the
        game owns its own header, difficulty picker, reset, and help button.
      */}
      <GameShell
        gameId="digital-house"
        title="The Digital House"
        chrome="headless"
      >
        <DigitalHouse />
      </GameShell>
    </>
  );
}
