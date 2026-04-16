/*
Copyright © 2026 Defend I.T. Solutions LLC. All Rights Reserved.

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
import { GridRunner } from "@/games/gridrunner";

export default function GridRunnerPage() {
  const canonical = "https://www.wedefendit.com/awareness/gridrunner";

  return (
    <>
      <Meta
        title="GRIDRUNNER | Defend I.T. Solutions"
        description="A cyberpunk RPG where you battle real-world APT groups, collect security tools, and defend the grid. Free to play."
        url={canonical}
        canonical={canonical}
      />
      {/*
        Full-viewport game — bypasses PageContainer because the centered
        content flow fights the h-dvh grid. GameShell in "headless" mode
        only provides context + the badge dialog; the game owns its own
        chrome (frame, HUD, controls).
      */}
      <GameShell gameId="gridrunner" title="GRIDRUNNER" chrome="headless">
        <GridRunner />
      </GameShell>
    </>
  );
}
