# GRIDRUNNER — Game Design Document

**Document owner:** Anthony Tropeano / Defend I.T. Solutions LLC
**Version:** 2.0 — Expanded World Spec
**Last updated:** 2026-04-15
**Status:** Pre-production — prototype in development

---

## 1. Game Overview

### 1.1 Concept

GRIDRUNNER is a top-down RPG with turn-based combat set in a stylized cyberspace. The player is a cyber operator who explores a Tron: Legacy-inspired world, battles threat actors in Pokemon-style encounters, and collects security tools through a Diablo-style randomized loot system.

The game wraps real cybersecurity concepts — APT groups, offensive/defensive tools, attack techniques — in an accessible, fun gameplay loop. A security professional recognizes the references. A general audience enjoys the game without needing to know what Cobalt Strike is.

### 1.2 Core Loop

```
Explore overworld → Enter building → Move through tiles →
Random encounter triggers → Battle → Earn XP + loot drop →
Level up → Equip better tools → Boss fight → Unlock next zone → Repeat
```

### 1.3 Genre & Tone

- **Genre:** Top-down RPG, turn-based combat, loot-driven progression
- **Tone:** Technically grounded, arcade energy, not edgy or corporate. Think Tron: Legacy meets Pokemon with a Diablo loot layer.
- **Rating:** All ages. No gore, no profanity, no graphic content.

### 1.4 Platform & Route

- **Platform:** Web (desktop + mobile responsive)
- **Route:** `/awareness/gridrunner/`
- **Integration:** Lives inside the existing wedefendit.com Next.js project under `src/games/gridrunner/`
- **Framework:** Uses the site's `Meta`, `Nav`. Does NOT use `PageContainer` or the shared `GameShell` wrapper (see §12.2). Game route is registered in `GAME_ROUTES` in `Layout.tsx` for full-viewport mode.

---

## 2. Audience

DIS awareness games serve everyone -- the same grandmother in The Villages who gets phishing emails, the teenager who games all day, and the CISO who lives this stuff professionally. GRIDRUNNER has to work for all of them.

- **Seniors and non-gamers:** First-time players who've never held a controller. The tutorial must be patient, the controls dead simple, text large and readable, touch targets generous. If grandma can't figure out how to move and fight within 2 minutes, the onboarding has failed.
- **General public, families, community groups:** People who play casually. They'll learn what Lazarus Group is by beating them, not by reading a textbook.
- **Security professionals:** They'll recognize the APT names, the tool references, the MITRE ATT&CK mappings. The game earns their respect by being technically accurate, not dumbed down.
- **All ages:** No gore, no profanity, no graphic content. A 10-year-old and a 70-year-old play the same game.
- **F2P model:** The audience skews toward people who want to play a game, not people who want a lecture.

### 2.1 Accessibility Imperatives

These are not optional. They gate whether the game reaches its audience.

- **Minimum 44px touch targets** on all interactive elements (already enforced by Playwright tests)
- **Readable font sizes** -- no text smaller than 12px on mobile, 14px on desktop
- **High contrast** -- neon on dark is inherently high contrast, but labels and body text must pass WCAG AA
- **Simple controls** -- D-pad + two buttons. That's it. No combos, no long-press, no gestures
- **Patient tutorial** -- the Arcade teaches one concept at a time. Movement first, then battle, then tools. Not a wall of text.
- **Persistent visual feedback** -- the rolling terminal log shows what just happened in plain English. No guessing why your HP dropped.
- **Keyboard-only play** fully supported on desktop (WASD/arrows + Enter/Space)
- **Screen reader considerations** -- semantic HTML throughout (already enforced: `<main>`, `<section>`, `<nav>`, `role="meter"` on HP bars, `aria-label` on all interactive regions)

---

## 3. Art Direction

### 3.1 Aesthetic

80s cyberpunk / Tron: Legacy. Neon on dark. Grid lines. Glow effects. Sleek black surfaces with thin luminous edge lines. The world is cyberspace visualized as a physical space.

### 3.2 Color Palette

| Element             | Color           | Hex       |
| ------------------- | --------------- | --------- |
| Background (deep)   | Near-black blue | `#0a0e1a` |
| Grid lines          | Dim cyan        | `#1a3a4a` |
| Primary neon        | Cyan            | `#00f0ff` |
| Secondary neon      | Magenta         | `#ff00de` |
| Accent              | Hot orange      | `#ff6b00` |
| Success / loot glow | Neon green      | `#00ff41` |
| Danger / damage     | Neon red        | `#ff003c` |
| Common item         | White           | `#e0e0e0` |
| Uncommon item       | Green           | `#00ff41` |
| Rare item           | Blue            | `#4da6ff` |
| Epic item           | Purple          | `#a855f7` |
| Legendary item      | Orange          | `#ff9500` |

### 3.3 Typography

- **UI/HUD:** Share Tech Mono (self-hosted, `public/fonts/`)
- **Titles/Headers:** Orbitron (self-hosted, `public/fonts/`)
- **Body/descriptions:** System sans-serif stack for readability

### 3.4 Visual Elements

- **Overworld tiles:** Geometric, grid-aligned, flat color with subtle neon edge glow
- **Digital Sea tiles:** Darker cyan with undulating ripple animation. Visually distinct from safe grid paths. Think the Sea of Simulation from Tron: Legacy -- raw, dangerous, alive.
- **Buildings:** Tron: Legacy-style structures -- sleek dark surfaces with thin neon edge lines. NOT realistic architecture. Think circuit board meets building silhouette with luminous outlines.
- **Player character:** Simple geometric avatar with neon outline. Animates on grid movement.
- **Enemies:** Abstract threat silhouettes. Each APT group has a distinct color/icon identity based on their nation's flag colors or a stylized emblem. NOT photo-realistic.
- **Battle screen:** Side-view. Player operator on left, APT agent on right. Background themed to the current building. HP/energy bars with neon styling.
- **Transitions:** CRT static / glitch effect when entering battles. Grid dissolve when transitioning between zones.
- **Loot drops:** Items glow their rarity color when dropped. Brief particle burst on pickup.

### 3.5 Overworld vs Building Interior

The overworld is the town map — outdoor grid connecting buildings. Each building has its own interior map that loads when the player walks to the entrance. Same top-down tile grid view, different tileset per building.

Think Pokemon: walk around a town → walk onto a building entrance → different interior map loads automatically → encounters happen inside → walk onto the exit tile → back to overworld. Auto-enter/exit, no button press.

---

## 4. Map & Buildings

### 4.1 Overworld

A top-down grid in Tron: Legacy style. The player walks between buildings. The overworld has two types of terrain:

- **Grid paths (safe):** Solid ground tiles connecting buildings. No encounters. Walk freely.
- **Digital Sea (encounter zones):** The raw simulation space between the grid -- inspired by the Sea of Simulation from Tron: Legacy. Visually distinct tiles with a ripple/wave animation, darker cyan with undulating glow. Walking through the Digital Sea triggers encounter checks (same RNG as building interiors). This gives players a grind option outside of buildings and makes the overworld feel alive and dangerous.

The overworld serves as the hub: navigate between buildings, access the shop (inside the arcade), manage inventory, check stats. Grid paths are the safe routes. The Digital Sea is the shortcut or the grind zone -- you can take the long safe path around, or cut through the sea and risk encounters.

**Viewport:** Fixed 16x12 tile viewport. Maps smaller than 16x12 are centered with void tiles. Maps larger than 16x12 use a camera that pans with the player. Tile size is always consistent across all maps.

**Digital Sea enemy pool:** Low-level ambient threats -- Script Kiddies, Cryptominers, Ransomware Bots. Not zone-specific. The sea is generic danger, not targeted APT activity. Think wild Pokemon in the grass between towns vs gym trainers inside.

### 4.2 Buildings — Full World

Each building is a zone with its own tileset, encounter table, and boss. 13 zones + 1 hub = 14 buildings total. 12 boss fights + 1 final boss. Progression is ordered for global variety -- no more than two bosses from the same nation back to back.

| #   | Building                | Sector                   | Tileset Theme                                         | Boss                  | Nation          | Locked Until        |
| --- | ----------------------- | ------------------------ | ----------------------------------------------------- | --------------------- | --------------- | ------------------- |
| —   | **Arcade**              | Hub / Tutorial           | Retro arcade machines, neon signs, coin-op cabinets   | None                  | —               | Always open         |
| 1   | **Bank**                | Financial                | Vault doors, terminals, transaction logs, safes       | Lazarus Group         | North Korea     | Always open         |
| 2   | **Hospital**            | Healthcare               | Patient terminals, medical devices, record systems    | APT33 / Elfin         | Iran            | Beat Lazarus        |
| 3   | **Power Plant**         | Critical Infrastructure  | SCADA panels, control rooms, turbine displays         | Sandworm              | Russia (GRU)    | Beat APT33          |
| 4   | **Port Authority**      | Maritime / Logistics     | Shipping manifests, crane controls, GPS systems       | APT40 / Leviathan     | China (MSS)     | Beat Sandworm       |
| 5   | **University**          | Research / Academia      | Lab terminals, research databases, email servers      | Kimsuky               | North Korea     | Beat APT40          |
| 6   | **Oil Refinery**        | Energy / Petroleum       | Pipeline HMIs, refinery SCADA, pressure gauges        | APT34 / OilRig        | Iran (MOIS)     | Beat Kimsuky        |
| 7   | **Telecom Tower**       | Communications           | Switch panels, fiber nodes, call routing, cell arrays | APT10 / Stone Panda   | China (MSS)     | Beat APT34          |
| 8   | **Government Building** | Espionage / Intel        | Classified terminals, secure comms, credential stores | APT28 / Fancy Bear    | Russia (GRU)    | Beat APT10          |
| 9   | **Data Center**         | Supply Chain / Cloud     | Server racks, VM consoles, CI/CD pipelines            | APT41 / Double Dragon | China (MSS)     | Beat APT28          |
| 10  | **Satellite Station**   | Aerospace / Comms        | Dish arrays, orbital trackers, uplink consoles        | Turla                 | Russia (FSB)    | Beat APT41          |
| 11  | **Embassy**             | Diplomacy / Intelligence | Encrypted comms, diplomatic cables, cipher rooms      | APT29 / Cozy Bear     | Russia (SVR)    | Beat Turla          |
| 12  | **Research Lab**        | Zero-Day R&D             | Firmware flashers, exploit dev stations, binary rigs  | Equation Group        | NSA / Five Eyes | Beat Cozy Bear      |
| 13  | **The Grid Core**       | Final Boss Arena         | Fractal geometry, infinite recursion, data streams    | The Alliance          | UN / Five Eyes  | Beat Equation Group |

**Nation sequence:** NK, Iran, Russia, China, NK, Iran, China, Russia, China, Russia, Russia, Five Eyes, Five Eyes. The Russia/Five Eyes clustering at the endgame is intentional -- the final arc is the escalation into state-level offensive capability.

### 4.3 Story & Narrative Arc

The player is a cyber operator recruited to defend the grid -- the interconnected digital infrastructure that civilization depends on. The grid is under siege. Nation-state threat actors are targeting every sector: finance, healthcare, energy, government, academia, supply chains.

**Act 1 — The Basics (Zones 1-3):** The operator trains at the Arcade, then faces their first real threats. Lazarus Group is stealing money. APT33 is destroying hospital systems. Sandworm is attacking the power grid. The threats are real, urgent, and the operator is learning the fundamentals: reconnaissance, exploitation, defense, persistence.

**Act 2 — The Expansion (Zones 4-7):** The scope widens. It's not just rogue hackers -- entire nations are running coordinated campaigns. China is stealing maritime secrets and hopping through telecom providers. North Korea is phishing universities. Iran is targeting oil infrastructure. The operator starts to understand that cyber threats follow a pattern: the Cyber Kill Chain. Every attack starts with recon, moves through weaponization and delivery, and ends with exfiltration or destruction.

**Act 3 — The Deep Game (Zones 8-11):** The most sophisticated adversaries. Russia's GRU, FSB, and SVR are all running separate campaigns -- espionage, satellite hijacking, diplomatic infiltration. China's APT41 is moonlighting between state missions and personal crime. The operator needs chained capabilities to compete at this level. Single tools aren't enough -- you need to combine recon with exploitation with persistence to match what these groups are doing.

**Act 4 — The Revelation (Zones 12-13):** The Equation Group -- the NSA's own offensive unit. The tools the player has been finding? Some of them were built by Five Eyes. EternalBlue, QUANTUM, FOXACID. The final boss, The Alliance, represents the full combined capability of Western intelligence. The game's message: in cyberspace, there are no permanent good guys. Every nation operates offensively. The only real defense is understanding how all of it works.

### 4.4 Nation-State Progression Arc

| Nation          | Zones        | Role in Narrative                                                                                                             |
| --------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| **North Korea** | 1, 5         | Entry-level. Financial crime funds the regime. Espionage targets academia.                                                    |
| **Iran**        | 2, 6         | Mid-tier. Destructive capability (wipers). Energy sector targeting.                                                           |
| **Russia**      | 3, 8, 10, 11 | Main campaign arc. Four agencies (GRU, GRU, FSB, SVR) with different missions. Critical infra, espionage, stealth, diplomacy. |
| **China**       | 4, 7, 9      | Scale and persistence. Maritime, telecom, supply chain. MSS operations across three sectors.                                  |
| **Five Eyes**   | 12, 13       | Endgame revelation. The defenders have the most powerful tools.                                                               |

### 4.4 Building Interior Structure

Each building interior is a tile grid (12x10 to 16x12 depending on building). Interior features:

- **Entry tile:** Where the player spawns when entering. Walking back to it exits to overworld.
- **Encounter tiles:** Visually distinct (e.g., slightly pulsing floor tiles, "corrupted" looking). Walking onto one triggers an RNG check -- 25-35% chance of random encounter per step on an encounter tile.
- **Boss tile:** Fixed location, visually distinct (larger glow, warning indicator). Walking onto it starts the boss fight. Only available after reaching a minimum level or clearing a set number of encounters in that building.
- **Loot tile:** Occasional fixed tile that gives a free loot drop (one-time, respawns on building re-entry after some time).
- **NPC tile:** Optional -- a character that gives a hint, tool tip, or lore about the APT group in this building.

### 4.5 Building Interior Templates

Like Pokemon, building interiors reuse a small set of base layouts. The tile grid, wall placement, and room structure are shared across buildings of the same type. What changes per zone is the visual cladding/styling -- colors, textures, decorative tiles, and thematic elements.

**Base layout templates:**

| Template             | Dimensions       | Description                                                                   | Used By                                |
| -------------------- | ---------------- | ----------------------------------------------------------------------------- | -------------------------------------- |
| **Small Interior**   | 12x10            | Single open room with perimeter walls, entry at bottom, boss area at top      | Arcade, University                     |
| **Medium Interior**  | 14x10            | Two connected rooms, corridor between, entry bottom-left, boss top-right      | Bank, Hospital, Oil Refinery           |
| **Large Interior**   | 16x12            | Multi-room with branching paths, entry at bottom-center, boss deep inside     | Power Plant, Data Center, Research Lab |
| **Complex Interior** | 16x14+ (panning) | Maze-like, multiple dead ends, hidden loot rooms, boss behind locked sub-area | Embassy, Satellite Station, Grid Core  |

**Per-zone cladding:** Same layout, different look. The Bank template has vault doors and terminal decorations. The Hospital uses the same Medium Interior template but with medical device props and patient record terminals. The tile grid and walkability are identical -- only the visual layer changes.

This means:

- New zones don't require new layouts from scratch
- Art pass applies cladding per zone on top of shared templates
- Playtesting and balance are consistent across same-template buildings

### 4.5 Arcade (Hub) Detail

The arcade is the spawn point and central hub. Interior includes:

- **Tutorial area:** First 2-3 tiles teach movement, then a scripted encounter (Script Kiddie) teaches battle mechanics. Happens once on first play.
- **Tool Shop:** A tile/NPC where the player can browse and buy tools using in-game currency (Bits) or premium currency (Credits).
- **Save terminal:** Visual representation of the auto-save.
- **Leaderboard terminal:** Future — displays scores/rankings.
- **Jukebox:** Easter egg / flavor.

### 4.6 Prototype Scope

For the initial prototype:

- **Playable:** Arcade (tutorial + shop) + Bank (full encounters + boss)
- **Visible but locked:** All other buildings shown on overworld map but inaccessible. "LOCKED — Complete [previous zone] to access" message on approach.
- This gives a complete gameplay loop: tutorial → grind → boss → reward, with visible future content to signal depth.

---

## 5. Player Character

### 5.1 The Operator

- **Name:** Player-chosen (text input at game start, stored in save state)
- **Default:** "OPERATOR" if left blank
- **Visual:** Geometric avatar with neon cyan outline.

### 5.2 Stats

| Stat                   | Description                                                             | Starting Value | Growth                 |
| ---------------------- | ----------------------------------------------------------------------- | -------------- | ---------------------- |
| **Integrity (HP)**     | Player health. Reaches 0 = battle lost.                                 | 100            | +8-12 per level        |
| **Compute (Energy)**   | Resource pool for using tools. Regenerates between battles, not during. | 50             | +4-6 per level         |
| **Bandwidth (Speed)**  | Determines turn order in battle. Higher = go first.                     | 10             | +1-2 per level         |
| **Firewall (Defense)** | Flat damage reduction on incoming attacks.                              | 5              | +1-2 per level         |
| **Level**              | Overall progression.                                                    | 1              | XP threshold per level |
| **XP**                 | Experience points. Earned from battles.                                 | 0              | Per encounter/boss     |

### 5.3 Inventory

- **Equipped tools:** 4 slots (expandable to 6 via progression or shop purchase)
- **Backpack:** 12 slots for unequipped tools. Can be expanded.
- **Bits:** In-game currency earned from battles. Spent at the shop.
- **Credits:** Premium currency (see §10 Monetization).

### 5.4 Leveling

| Level | XP Required | Unlocks                                        |
| ----- | ----------- | ---------------------------------------------- |
| 1     | 0           | Starter tools                                  |
| 3     | 150         | Uncommon tools can drop                        |
| 5     | 400         | Rare tools can drop, Hashcat available in shop |
| 7     | 800         | Ghidra available in shop                       |
| 10    | 1500        | Epic tools can drop, Snort/Suricata available  |
| 15    | 3000        | Legendary tools can drop                       |
| 20    | 5000        | Prototype cap                                  |
| 25    | 8000        | Expanded world mid-point                       |
| 30    | 12000       | Endgame tools available                        |
| 35    | 18000       | Legendary set bonuses active                   |
| 40    | 25000       | Max level (full game cap)                      |

### 5.5 Skill Grid (FFX Sphere Grid Model)

Beyond flat level-up stat boosts, GRIDRUNNER uses a skill grid progression system inspired by Final Fantasy X's Sphere Grid. The grid is structured around real cybersecurity frameworks and represents the operator's growing capability.

**Core concept:** Levels give you stats. The skill grid gives you capability. You can be high level with raw power but still lack the specific technique chains needed to defeat advanced APTs. Beating bosses and completing zones unlocks grid nodes. Grid nodes unlock techniques, tool upgrades, and attack chains.

#### 5.5.1 Grid Structure — Cyber Kill Chain

The skill grid is organized around the Lockheed Martin Cyber Kill Chain phases. Each phase is a branch of the grid. Progressing through zones unlocks nodes along these branches.

| Kill Chain Phase          | Grid Branch            | Unlocks                                                      | Relevant Zones               |
| ------------------------- | ---------------------- | ------------------------------------------------------------ | ---------------------------- |
| **Reconnaissance**        | Scanning & Enumeration | Nmap upgrades, passive recon, OSINT techniques               | Bank, University             |
| **Weaponization**         | Payload Development    | Tool crafting, exploit modification, custom signatures       | Hospital, Oil Refinery       |
| **Delivery**              | Access & Deployment    | Phishing resistance, delivery method counters, ingress tools | Gov Building, Port Authority |
| **Exploitation**          | Vulnerability Research | Metasploit upgrades, zero-day research, CVE chaining         | Telecom Tower, Data Center   |
| **Installation**          | Persistence Mechanisms | Mimikatz upgrades, rootkit detection, backdoor analysis      | Satellite Station, Embassy   |
| **Command & Control**     | C2 Operations          | Cobalt Strike upgrades, beacon detection, traffic analysis   | Power Plant, Research Lab    |
| **Actions on Objectives** | Mission Execution      | Chained attack sequences, combined tool effects              | The Grid Core                |

#### 5.5.2 MITRE ATT&CK Mapping

Each grid node maps to a real MITRE ATT&CK technique ID. This grounds the progression in actual threat intelligence. When a player unlocks a node, they're learning a real technique.

Example node mappings:

| Grid Node              | ATT&CK ID | Technique                | In-Game Effect                                                          |
| ---------------------- | --------- | ------------------------ | ----------------------------------------------------------------------- |
| Port Scan Mastery      | T1046     | Network Service Scanning | Nmap +20% power, reveals enemy defense stat                             |
| Credential Harvesting  | T1003     | OS Credential Dumping    | Mimikatz chains with Recon tools for bonus damage                       |
| Supply Chain Awareness | T1195     | Supply Chain Compromise  | Detect Supply Chain Worm enemies before encounter (reduced ambush rate) |
| DNS Tunnel Detection   | T1071.004 | DNS Protocol C2          | Defense tools counter OilRig's DNS Tunnel bypass                        |
| Firmware Analysis      | T1542     | Pre-OS Boot              | Required to damage Equation Group (bypasses NOBUS Protocol)             |

_Full node list defined per zone as zones enter development._

#### 5.5.3 Attack Chains

Late-game bosses require chained techniques -- using multiple tools in sequence within a battle, where each tool in the chain amplifies the next. This mirrors real-world attack methodology where reconnaissance informs exploitation which enables persistence.

Example chains:

- **Recon → Exploit:** Use Nmap first, then Metasploit next turn gets +30% accuracy (you scanned before you attacked)
- **Exploit → Persistence:** Use Metasploit, then Mimikatz next turn gets +25% power (you exploited, now you're extracting)
- **Defense → Recon:** Use Firewall Rule, then Wireshark next turn reveals enemy's next 2 moves (you blocked, now you're analyzing)
- **Full Chain (Recon → Exploit → Persistence → Defense):** All four types used in sequence across 4 turns grants "Kill Chain Complete" buff: +50% all stats for 2 turns

Chains are unlocked via the skill grid. Early game you just spam your best tool. Late game you need to think about sequencing.

#### 5.5.4 Boss Technique Requirements

Certain bosses have mechanics that can only be countered by specific skill grid unlocks. You can brute-force them with raw stats, but having the right technique makes the fight significantly easier. This encourages exploring the skill grid rather than just grinding levels.

| Boss           | Required Technique       | Without It                                              |
| -------------- | ------------------------ | ------------------------------------------------------- |
| Sandworm       | C2 Detection (grid node) | Cannot counter BlackEnergy energy drain                 |
| APT41          | Supply Chain Awareness   | ShadowPad persist damage is undispellable               |
| Turla          | Satellite Comm Analysis  | Satellite Hijack redirect is unavoidable                |
| Equation Group | Firmware Analysis        | NOBUS Protocol makes boss unkillable below 15% HP       |
| The Alliance   | Full Kill Chain mastery  | Adapt Protocol rotates faster than you can switch types |

_Prototype scope: Skill grid is designed but not implemented. V1 uses flat leveling. Skill grid ships in V3 or V4._

---

## 6. Tools (Loot System)

Tools are the core collectible. They replace Pokemon moves and function as Diablo-style loot — each tool drops with randomized stats based on rarity.

### 6.1 Tool Properties

| Property        | Description                                                     |
| --------------- | --------------------------------------------------------------- |
| **Name**        | Real security tool name                                         |
| **Type**        | Recon, Exploit, Defense, Persistence                            |
| **Rarity**      | Common, Uncommon, Rare, Epic, Legendary                         |
| **Power**       | Base damage/effect value (rolled within a range per rarity)     |
| **Accuracy**    | Hit chance percentage (rolled within a range)                   |
| **Energy Cost** | Compute drain per use (rolled within a range — lower is better) |
| **Prefix**      | Optional stat modifier (rarity Rare+)                           |
| **Suffix**      | Optional special effect (rarity Epic+)                          |
| **Description** | One-line plain-English explanation of what it does IRL          |

### 6.2 Rarity Tiers

| Rarity                 | Stat Multiplier | Prefix?        | Suffix?        | Drop Weight |
| ---------------------- | --------------- | -------------- | -------------- | ----------- |
| **Common** (white)     | 0.8-1.0x base   | No             | No             | 55%         |
| **Uncommon** (green)   | 0.9-1.15x base  | No             | No             | 25%         |
| **Rare** (blue)        | 1.0-1.3x base   | Yes (1 prefix) | No             | 13%         |
| **Epic** (purple)      | 1.1-1.5x base   | Yes (1 prefix) | Yes (1 suffix) | 5%          |
| **Legendary** (orange) | 1.3-1.7x base   | Yes (1 prefix) | Yes (1 suffix) | 2%          |

### 6.3 Base Tool Definitions

| Tool           | Type        | Base Power | Base Accuracy | Base Energy | Real-World Basis                                   |
| -------------- | ----------- | ---------- | ------------- | ----------- | -------------------------------------------------- |
| Nmap           | Recon       | 15         | 95%           | 5           | Network scanner — finds open ports and services    |
| Wireshark      | Recon       | 10         | 100%          | 3           | Packet analyzer — sees what's on the wire          |
| Metasploit     | Exploit     | 35         | 75%           | 15          | Exploitation framework — delivers payloads         |
| Firewall Rule  | Defense     | 0 (blocks) | 85%           | 8           | Blocks incoming attack, reduces damage next turn   |
| Cobalt Strike  | Exploit     | 45         | 70%           | 20          | Adversary simulation — command and control         |
| Burp Suite     | Recon       | 25         | 90%           | 10          | Web app scanner — finds web vulnerabilities        |
| YARA Rules     | Defense     | 0 (detect) | 90%           | 6           | Pattern matcher — identifies known malware         |
| Mimikatz       | Persistence | 40         | 80%           | 18          | Credential extractor — dumps passwords from memory |
| Hashcat        | Exploit     | 30         | 85%           | 12          | Password cracker — brute forces hashed credentials |
| Ghidra         | Recon       | 20         | 95%           | 8           | Reverse engineering tool — analyzes compiled code  |
| Snort/Suricata | Defense     | 0 (blocks) | 88%           | 12          | Network IDS — detects and blocks malicious traffic |
| Zero-Day       | Exploit     | 60         | 50%           | 30          | Unknown vulnerability — no patch exists            |

### 6.4 Prefixes (Rare+)

| Prefix      | Effect                                       | Applicable Types |
| ----------- | -------------------------------------------- | ---------------- |
| Hardened    | +15% accuracy                                | Defense          |
| Polymorphic | +20% power                                   | Exploit          |
| Obfuscated  | -20% energy cost                             | All              |
| Persistent  | +10% power, adds 3 dmg/turn bleed            | Persistence      |
| Stealthy    | +10% accuracy, +10% crit chance              | Recon            |
| Distributed | +25% power, +15% energy cost                 | Exploit          |
| Redundant   | Blocks 2 attacks instead of 1                | Defense          |
| Automated   | -30% energy cost, -10% accuracy              | All              |
| Weaponized  | Changes type to Exploit, +15% power          | Recon            |
| Adaptive    | +5% power per consecutive use (caps at +20%) | All              |

### 6.5 Suffixes (Epic+)

| Suffix               | Effect                                               |
| -------------------- | ---------------------------------------------------- |
| ...of Exfiltration   | On hit: steal 5 Compute from enemy                   |
| ...of Persistence    | On hit: 25% chance to apply 5 dmg/turn for 3 turns   |
| ...of Evasion        | After using: +15% dodge chance next enemy turn       |
| ...of Disruption     | On hit: 20% chance to lock one enemy tool for 1 turn |
| ...of Escalation     | On kill: refund 50% energy cost                      |
| ...of Reconnaissance | On hit: reveal enemy's next planned attack           |
| ...of Fortification  | On use: gain 10 temporary Integrity (decays 5/turn)  |
| ...of Propagation    | On hit: 15% chance to hit twice                      |

### 6.6 Tool Drop Tables

Each building zone has a weighted drop table. Tables for zones 1-4 defined below. Zones 5-13 defined when entering development.

**Bank (Financial):** Exploit 35%, Persistence 25%, Recon 20%, Defense 20%. Bonus: Hashcat, Mimikatz 2x rate.

**Hospital (Healthcare):** Defense 35%, Recon 25%, Exploit 20%, Persistence 20%. Bonus: YARA Rules, Firewall Rule 2x rate.

**Power Plant (Critical Infra):** Recon 35%, Defense 25%, Exploit 25%, Persistence 15%. Bonus: Snort/Suricata, Ghidra 2x rate.

**Government (Espionage):** Persistence 30%, Recon 25%, Exploit 25%, Defense 20%. Bonus: Cobalt Strike, Burp Suite 2x rate.

### 6.7 Boss Drops

1. **Guaranteed first-kill drop:** A specific tool at Rare or higher rarity. One-time only.
2. **Random boss loot roll:** Every kill (including re-fights) rolls with boosted rarity weights (+15% across tiers).

### 6.8 Starter Kit

New players start with 4 Common tools with fixed stats:

- Nmap (Recon) — Power 15, Accuracy 95%, Energy 5
- Wireshark (Recon) — Power 10, Accuracy 100%, Energy 3
- Metasploit (Exploit) — Power 35, Accuracy 75%, Energy 15
- Firewall Rule (Defense) — Power 0, Accuracy 85%, Energy 8

---

## 7. Enemies

### 7.1 Random Encounter Enemies

| Enemy                 | Zone(s)                          | Theme                         | Moves                                                                                               |
| --------------------- | -------------------------------- | ----------------------------- | --------------------------------------------------------------------------------------------------- |
| **Script Kiddie**     | Arcade, Bank                     | Low-skill, copy-paste attacks | DDoS Ping (10 dmg), Downloaded Exploit (15 dmg), Rage Quit (heals self 10)                          |
| **Hacktivist**        | Bank, Hospital                   | Ideological, defacement       | Deface (15 dmg), Doxx Attempt (20 dmg + 3/turn bleed), Manifesto (buffs own power 10%)              |
| **Insider Threat**    | Hospital, Gov, Embassy           | Privileged access, data theft | Credential Abuse (20 dmg), Data Copy (15 dmg + energy drain 5), Badge Clone (25 dmg)                |
| **Ransomware Bot**    | All buildings                    | Automated ransomware          | Encrypt (20 dmg + lock 1 tool 1 turn), Ransom Note (10 dmg), Spread (15 dmg)                        |
| **Phishing Drone**    | Bank, Gov, University            | Social engineering            | Spear Phish (25 dmg), Credential Harvest (15 dmg + energy drain 8), Spoofed Email (20 dmg)          |
| **Supply Chain Worm** | Data Center, Telecom, Port       | Dependency poisoning          | Inject Dependency (25 dmg + persist 5/turn), Typosquat (15 dmg), Update Backdoor (30 dmg)           |
| **Cryptominer**       | All buildings (mid+)             | Resource theft                | Mine Block (10 dmg + energy drain 10), Pool Connect (20 dmg), Overclock (buffs own speed 20%)       |
| **Spyware Agent**     | Embassy, Satellite, Research Lab | Surveillance                  | Keylog (15 dmg + reveal player's next tool), Screen Capture (20 dmg), Exfil (25 dmg + steal 5 Bits) |
| **Firmware Implant**  | Research Lab, Grid Core          | Low-level persistence         | Flash ROM (30 dmg + lock 1 tool 2 turns), Bootkit (20 dmg + persist 8/turn), Brick (35 dmg)         |

Random enemy stats scale: base HP 40-60 at Bank level, increasing ~20% per zone.

### 7.2 APT Bosses — Full Roster

#### Boss 1: Lazarus Group (North Korea) — Bank

- **HP:** 200 | **Level:** 5
- **Attacks:** Ransomware Deploy (35 dmg + lock 1 tool 2 turns), Crypto Miner (15 dmg/turn + energy drain 5/turn, 3 turns), Bank Heist (25 dmg), Swift Exploit (40 dmg, charges 1 turn)
- **Weakness:** Defense tools (1.5x)
- **First-kill loot:** YARA Rules (Rare+)
- **Intel:** North Korea's state-sponsored theft operation. Bangladesh Bank heist, WannaCry, billions in crypto theft. They fund the regime through cybercrime.

#### Boss 2: APT33 / Elfin (Iran) — Hospital

- **HP:** 280 | **Level:** 8
- **Attacks:** Wiper Payload (40 dmg), Web Shell (20 dmg + persist 5/turn 3 turns), Shamoon Variant (30 dmg + destroys lowest-rarity equipped tool), Patient Record Exfil (25 dmg + heals self 15)
- **Weakness:** Exploit tools (1.5x)
- **First-kill loot:** Burp Suite (Rare+)
- **Intel:** Targets energy, aerospace, healthcare. Known for Shamoon wiper malware that doesn't just steal data — it destroys systems entirely.

#### Boss 3: Sandworm (Russia GRU) — Power Plant

- **HP:** 380 | **Level:** 12
- **Attacks:** Grid Shutdown (45 dmg + disables Defense tools 1 turn), NotPetya (30 dmg + hits again for 15 next turn), Industroyer (40 dmg), BlackEnergy (35 dmg + energy drain 10)
- **Weakness:** Recon tools (1.5x)
- **First-kill loot:** Snort/Suricata (Epic+)
- **Intel:** Russia's GRU Unit 74455. Shut down Ukraine's power grid twice, launched NotPetya ($10B+ in damages), attacked the 2018 Olympics.

#### Boss 4: APT28 / Fancy Bear (Russia GRU) — Government Building

- **HP:** 500 | **Level:** 16
- **Attacks:** Spear Phish Campaign (30 dmg + 25% lock random tool 2 turns), Brute Force (20 dmg hits twice), Credential Dump (25 dmg + energy drain 8), X-Agent Implant (20 dmg + persist 8/turn 4 turns)
- **Phase 2 (below 50% HP):** Cozy Bear Assist — heals 40 HP, gains +10% damage
- **Weakness:** Defense tools (1.5x)
- **First-kill loot:** Cobalt Strike (Epic+)
- **Intel:** Russia's GRU military intelligence. Hacked the DNC in 2016, targeted NATO and European governments. Specialize in credential theft and espionage.

#### Boss 5: Kimsuky (North Korea) — University

- **HP:** 550 | **Level:** 19
- **Attacks:** Phishing Professor (35 dmg + 30% lock random tool 2 turns), Research Theft (25 dmg + steal 10 Bits), Backdoor Installer (20 dmg + persist 6/turn 3 turns), Fake Conference Invite (30 dmg + accuracy debuff 15% 2 turns)
- **Weakness:** Recon tools (1.5x)
- **First-kill loot:** Ghidra (Rare+)
- **Intel:** Targets think tanks, universities, and nuclear research. Elaborate social engineering — fake personas, spoofed conference invitations — to steal research from academics.

#### Boss 6: APT40 / Leviathan (China MSS) — Port Authority

- **HP:** 650 | **Level:** 22
- **Attacks:** Anchor Drop (40 dmg + reduces player speed 20% 3 turns), Container Intercept (30 dmg + steal 15 Bits), Sonar Ping (25 dmg + next 2 attacks +15% accuracy), Depth Charge (50 dmg, charges 1 turn)
- **Weakness:** Defense tools (1.5x)
- **First-kill loot:** Wireshark (Epic+)
- **Intel:** Operates from Hainan Island for China's MSS. Targets maritime industries, naval contractors, and South China Sea rivals. Stolen ship designs and port logistics data.

#### Boss 7: APT10 / Stone Panda (China MSS) — Telecom Tower

- **HP:** 750 | **Level:** 25
- **Attacks:** Cloud Hop (35 dmg + drains 12 energy, ignores defense), MSP Pivot (25 dmg + persist 7/turn 3 turns), Data Intercept (30 dmg + 20% copy one player tool temporarily), Silent Listener (15 dmg/turn 4 turns, no miss)
- **Weakness:** Exploit tools (1.5x)
- **First-kill loot:** Mimikatz (Epic+)
- **Intel:** Compromised managed service providers to reach hundreds of downstream targets across 12+ countries. Operation Cloud Hopper — one of the largest espionage campaigns ever discovered.

#### Boss 8: APT41 / Double Dragon (China MSS) — Data Center

- **HP:** 850 | **Level:** 28
- **Attacks:** Supply Chain Inject (45 dmg + lock 2 tools 1 turn), ShadowPad Deploy (30 dmg + persist 8/turn 3 turns), Dual Mission (35 dmg + steal 20 Bits), Kernel Rootkit (40 dmg + disables Defense tools 2 turns)
- **Phase 2 (below 40% HP):** Moonlighting — alternates espionage/financial attacks, +25% power each swap
- **Weakness:** Persistence tools (1.5x)
- **First-kill loot:** Cobalt Strike (Legendary)
- **Intel:** State-sponsored espionage by day, personal cybercrime by night. Backdoored CCleaner and ASUS Live Update, compromised game companies, stole COVID research. Five members indicted by DOJ in 2020.

#### Boss 9: APT34 / OilRig (Iran MOIS) — Oil Refinery

- **HP:** 900 | **Level:** 30
- **Attacks:** DNS Tunnel (30 dmg + energy drain 15, bypasses defense), Pressure Override (45 dmg), Social Engineer (25 dmg + lock 1 tool 3 turns), Pipeline Rupture (55 dmg, charges 1 turn)
- **Phase 2 (below 35% HP):** Emergency Shutdown — gains +30% defense, attacks every 2 turns at double damage
- **Weakness:** Recon tools (1.5x)
- **First-kill loot:** Snort/Suricata (Legendary)
- **Intel:** Targets Middle Eastern governments, financial institutions, and energy. Pioneered DNS tunneling for exfiltration. Deployed destructive malware against Saudi and Gulf state targets.

#### Boss 10: Turla (Russia FSB) — Satellite Station

- **HP:** 1000 | **Level:** 33
- **Attacks:** Satellite Hijack (40 dmg + redirect: next player attack hits self 50%), Carbon Implant (25 dmg + persist 10/turn 4 turns), Penguin Turla (35 dmg, 100% accuracy), Orbit Decay (30 dmg/turn 3 turns, undispellable)
- **Phase 2 (below 30% HP):** Snake Protocol — regenerates 15 HP/turn for rest of fight
- **Weakness:** Exploit tools (1.5x)
- **First-kill loot:** Zero-Day (Epic+)
- **Intel:** One of the most sophisticated groups ever, attributed to Russia's FSB. Hijacked satellite internet for C2, backdoored other APT groups' infrastructure, maintained access to targets for over a decade undetected.

#### Boss 11: APT29 / Cozy Bear (Russia SVR) — Embassy

- **HP:** 1200 | **Level:** 36
- **Attacks:** Sunburst Payload (50 dmg + disables all Defense tools 2 turns), WellMess (30 dmg + persist 8/turn 4 turns + energy drain 5/turn), Diplomatic Pouch (35 dmg + steal 25 Bits + heal self 20), Patience (nothing this turn, next attack deals 3x damage)
- **Phase 2 (below 25% HP):** Deep Cover — untargetable 1 turn, fully heals energy, +20% all stats
- **Weakness:** Persistence tools (1.5x)
- **First-kill loot:** Mimikatz (Legendary)
- **Intel:** Russia's SVR foreign intelligence. Executed the SolarWinds supply chain attack — compromising 18,000 organizations including multiple US agencies. Target embassies, foreign affairs ministries, COVID vaccine research. Their hallmark is patience.

#### Boss 12: Equation Group (NSA / Five Eyes) — Research Lab

- **HP:** 1500 | **Level:** 38
- **Attacks:** EternalBlue (55 dmg + lock 2 tools 2 turns), Firmware Flash (40 dmg + permanent -5% accuracy debuff, stacks), QUANTUM Insert (45 dmg, 100% accuracy), FOXACID Redirect (35 dmg + next player tool costs 2x energy)
- **Phase 2 (below 40% HP):** Shadow Brokers Leak — all attacks +20% power, randomizes move order
- **Phase 3 (below 15% HP):** NOBUS Protocol — heals to 30% HP once, +50% defense
- **Weakness:** None — neutral damage across all types. Raw stats only.
- **First-kill loot:** Zero-Day (Legendary)
- **Intel:** Widely attributed to the NSA's Tailored Access Operations. Their tools — revealed by the Shadow Brokers leak — included EternalBlue (later used in WannaCry/NotPetya), firmware implants surviving disk wipes, and web traffic interception at scale. The highest tier of cyber capability.

#### Final Boss: The Alliance (UN / Five Eyes Coalition) — The Grid Core

- **HP:** 2000 | **Level:** 40
- **Attacks:** Coalition Strike (60 dmg, hits twice 80% accuracy each), Five Eyes Network (40 dmg + locks player's highest-power tool 2 turns), Signal Intelligence (30 dmg + copies player's last tool effect back at them), Regulatory Framework (0 dmg, disables 2 random tools 3 turns), International Warrant (50 dmg + drains all remaining energy)
- **Phase 2 (below 50% HP):** Adapt Protocol — becomes resistant to last tool type used (0.5x 2 turns). Forces type rotation.
- **Phase 3 (below 20% HP):** Full Spectrum — all attacks +30% power, speed doubles, heals 100 HP once
- **Weakness:** Adapts. No fixed weakness. Must use all four tool types.
- **First-kill loot:** Legendary tool of player's most-used type, guaranteed prefix AND suffix
- **Intel:** The final revelation: in cyberspace, there are no permanent allies — only permanent interests. The Alliance represents the combined signals intelligence apparatus of the Five Eyes. The player hasn't been fighting evil — they've been navigating a landscape where every nation acts in its own interest. The only real defense is understanding the game.

### 7.3 Enemy Scaling

- **Base HP:** Zone base + (player level x 3)
- **Base damage:** Zone base + (player level x 1.5)
- **XP reward:** Zone base + (player level x 2)
- **Bits reward:** Zone base + (player level x 1)
- **Loot chance:** 60% per random encounter (100% from bosses)

---

## 8. Battle System

### 8.1 Overview

Turn-based, 1v1 (player vs enemy). Transitions from overworld to a dedicated battle screen.

### 8.2 Turn Flow

1. **Player selects action:** Pick a tool, open inventory (swap costs a turn), or attempt to run.
2. **Enemy selects action:** AI picks from weighted attack pool.
3. **Speed check:** Compare Bandwidth. Higher goes first. Ties favor the player.
4. **First actor resolves:** Accuracy roll, damage = power x type effectiveness - defense, status effects, 5% crit chance (1.5x).
5. **Second actor resolves:** Same process.
6. **End-of-turn effects:** Tick persistent damage, decay buffs, check win/lose.
7. **Repeat.**

### 8.3 Type Effectiveness

| Attacker Type | Strong Against (1.5x) | Weak Against (0.75x) |
| ------------- | --------------------- | -------------------- |
| Recon         | Persistence           | Defense              |
| Exploit       | Defense               | Persistence          |
| Defense       | Exploit               | Recon                |
| Persistence   | Recon                 | Exploit              |

### 8.4 Defense Tool Mechanics

- **Firewall Rule:** Blocks next incoming attack. Absorbs damage equal to power stat.
- **YARA Rules:** Reveals enemy's next attack. Deals 50% power as quarantine damage.
- **Snort/Suricata:** Blocks AND reflects 30% of blocked damage.

### 8.5 Status Effects

| Effect              | Description                        | Duration          |
| ------------------- | ---------------------------------- | ----------------- |
| **Bleed**           | X damage at end of each turn       | 2-4 turns         |
| **Tool Lock**       | One equipped tool unusable         | 1-3 turns         |
| **Energy Drain**    | Lose X Compute at end of each turn | 2-3 turns         |
| **Accuracy Debuff** | All tools lose X% accuracy         | 1-2 turns         |
| **Fortify**         | Gain temporary HP (decays)         | Until depleted    |
| **Empowered**       | Next attack deals 1.5x damage      | 1 turn (consumed) |

### 8.6 Running

Random encounters only (not bosses). Success: 50% + (player Bandwidth - enemy speed) x 5%. Failed run wastes the turn.

### 8.7 Win / Lose

- **Win:** Enemy HP 0. Earn XP, Bits, loot roll.
- **Lose:** Player HP 0. Respawn at building entrance. Keep XP and inventory. Lose 10% Bits.

---

## 9. Progression

### 9.1 XP Rewards

| Source            | XP                |
| ----------------- | ----------------- |
| Script Kiddie     | 15-20             |
| Hacktivist        | 25-30             |
| Insider Threat    | 30-40             |
| Ransomware Bot    | 20-30             |
| Phishing Drone    | 25-35             |
| Supply Chain Worm | 35-45             |
| Cryptominer       | 20-30             |
| Spyware Agent     | 30-40             |
| Firmware Implant  | 40-55             |
| Boss (first kill) | 200-1000 (scales) |
| Boss (re-fight)   | 50% of first-kill |

### 9.2 Bits Rewards

| Source            | Bits            |
| ----------------- | --------------- |
| Random encounter  | 5-15            |
| Boss (first kill) | 50-200 (scales) |
| Boss (re-fight)   | 25-100          |
| Loot tile         | 3-8             |

### 9.3 Badges

| Badge               | Condition             | Tier   |
| ------------------- | --------------------- | ------ |
| Grid Runner         | Complete the tutorial | Bronze |
| Bank Buster         | Defeat Lazarus Group  | Bronze |
| First Responder     | Defeat APT33          | Silver |
| Grid Defender       | Defeat Sandworm       | Silver |
| Bear Hunter         | Defeat APT28          | Gold   |
| Scholar's Shield    | Defeat Kimsuky        | Silver |
| Sea Wall            | Defeat APT40          | Silver |
| Signal Breaker      | Defeat APT10          | Gold   |
| Dragon Slayer       | Defeat APT41          | Gold   |
| Refinery Secured    | Defeat APT34          | Gold   |
| Orbit Denied        | Defeat Turla          | Gold   |
| Diplomatic Immunity | Defeat APT29          | Gold   |
| Shadow Broker       | Defeat Equation Group | Gold   |
| Cyber Sovereign     | Defeat The Alliance   | Gold   |
| Loot Hoarder        | Collect 50 tools      | Bronze |
| Epic Collector      | Find an Epic tool     | Silver |
| Legendary Find      | Find a Legendary tool | Gold   |
| Max Operator        | Reach max level       | Gold   |

### 9.4 Building Unlock Progression

```
Arcade (always open) → Bank (always open) →
Hospital (beat Lazarus) → Power Plant (beat APT33) →
Port Authority (beat Sandworm) → University (beat APT40) →
Oil Refinery (beat Kimsuky) → Telecom Tower (beat APT34) →
Gov Building (beat APT10) → Data Center (beat APT28) →
Satellite Station (beat APT41) → Embassy (beat Turla) →
Research Lab (beat Cozy Bear) → The Grid Core (beat Equation Group)
```

---

## 10. Monetization

### 10.1 Model

Free to play. Full game completable without spending. Monetization provides convenience and cosmetics. Never pay-to-win.

### 10.2 Currencies

| Currency    | Earned              | Purchased        |
| ----------- | ------------------- | ---------------- |
| **Bits**    | Battles, loot tiles | Buy with Credits |
| **Credits** | Not earnable        | Real money       |

### 10.3 Credit Pricing

| Credits | Price  |
| ------- | ------ |
| 100     | $0.99  |
| 500     | $3.99  |
| 1200    | $7.99  |
| 3000    | $16.99 |

### 10.4 What's Never Buyable

Boss completion, badges, specific named tools, stat boosts, level skips.

---

## 11. Educational Layer

### 11.1 Philosophy

Every battle teaches something, but the game never stops to lecture. Education happens through exposure and context, not pop-up quizzes.

### 11.2 Mechanisms

| Mechanism                    | When                         | Content                                                                                                     |
| ---------------------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Tool descriptions**        | Inventory, shop, loot pickup | One-line plain-English explanation                                                                          |
| **Enemy intro card**         | Battle start                 | "THREAT IDENTIFIED" with name, nation, one-line summary                                                     |
| **Post-battle Intel Report** | Boss defeat (first kill)     | 3-4 sentence IRL summary with real incidents                                                                |
| **NPC hints**                | Building interiors           | Sector threat landscape tips                                                                                |
| **Badge descriptions**       | Badge earned modal           | Security context reinforcement                                                                              |
| **Identity Disc**            | Anytime (dedicated button)   | Full encyclopedia: threat profiles, tool manuals, kill chain guide, ATT&CK index, intel archive (see §11.4) |

### 11.3 Tone

- Factual, not alarmist
- Real names, real incidents
- Player is a defender, not a hacker
- **Plain English always.** Tool descriptions, intel reports, and NPC hints are written for someone who doesn't know what a port scan is. A grandmother in The Villages, a teenager, and a CISO should all get something out of every piece of text.
- No jargon without context. "Nmap scanned the network" not "Nmap performed a SYN scan on the target's TCP stack"

### 11.4 The Identity Disc (In-Game Encyclopedia)

Inspired by Tron: Legacy's identity disc -- the disc that stores everything about the user. In GRIDRUNNER, the Identity Disc is the player's knowledge base, codex, and man page system. Accessible from any screen via a dedicated button/hotkey.

**Starts mostly empty. Fills as you play.** Every encounter, every tool, every boss teaches you something and the Disc records it. This is the primary educational delivery mechanism.

#### Disc Sections

| Section              | Unlocked By                | Content                                                                                                                                                                                                   |
| -------------------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Threat Profiles**  | Encountering an enemy      | APT group name, nation, real-world summary, known operations, ATT&CK group ID. Random enemies get shorter entries. Bosses get full dossiers with incident references.                                     |
| **Tool Manual**      | Finding/buying a tool      | What the tool does IRL in plain English, in-game stats, type, what it's strong/weak against. Basically a man page.                                                                                        |
| **Kill Chain Guide** | Progressing through zones  | Each Cyber Kill Chain phase explained simply. "Reconnaissance means finding out what's there before you attack." Unlocks as the skill grid opens branches.                                                |
| **Type Chart**       | Completing the tutorial    | The 4-type effectiveness grid. Always accessible. Visual, not a wall of text.                                                                                                                             |
| **Status Effects**   | First time affected        | What each status does, how long it lasts, what counters it. Unlocks as you experience them.                                                                                                               |
| **ATT&CK Index**     | Unlocking skill grid nodes | Real MITRE ATT&CK technique IDs with plain-English descriptions. "T1046 -- Network Service Scanning: checking what services are running on a target. Like knocking on every door to see which ones open." |
| **Intel Archive**    | Defeating a boss           | The full post-battle intel report, re-readable anytime. Real incidents, real dates, real impact.                                                                                                          |
| **Sector Briefs**    | Entering a new building    | One paragraph on why this sector matters. "Banks are targeted because that's where the money is. Lazarus Group stole $81 million from Bangladesh's central bank in 2016."                                 |

#### Design Principles

- **Accessible mid-battle.** Player can open the Disc during their turn to check a tool's stats or read what a status effect does. No penalty. Grandma should be able to pause and read.
- **Progressive disclosure.** New entries glow/pulse when added. The Disc starts sparse and fills up, giving a sense of growing expertise.
- **Two reading levels.** Each entry has a headline (plain English, one sentence) and optional detail (deeper explanation for those who want it). Nobody is forced to read walls of text.
- **Searchable.** On desktop, text search. On mobile, categorized tabs.
- **Persistent.** Stored in save state. You don't lose knowledge on death.

#### Implementation

- Separate screen accessible from overworld, building, and battle (during player turn)
- Keyboard shortcut: Tab or I
- Mobile: dedicated Disc button in the HUD (small, doesn't compete with d-pad/A/B)
- Data stored in save as `unlockedDiscEntries: string[]`
- Content defined in static JSON files per category
- Ships incrementally: V1 gets Tool Manual + Type Chart. Full Disc by V3.

---

## 12. Technical Architecture

### 12.1 Directory Structure

```
src/games/gridrunner/
├── GridRunner.tsx              # Top-level component, screen state machine
├── GridRunnerShell.tsx         # Frame container, controls, font-face declarations
├── index.ts                    # Barrel export
├── engine/                     # Pure game logic — ZERO rendering imports
│   ├── battle.ts               # Turn resolution, damage calc
│   ├── enemies.ts              # Enemy definitions, AI, zone configs
│   ├── movement.ts             # Movement, collision
│   ├── save.ts                 # localStorage CRUD
│   └── types.ts                # All types
├── data/maps/
│   ├── index.ts                # Map registry
│   ├── overworld.ts            # 16x12 overworld
│   ├── arcade.ts               # 12x10 arcade interior
│   └── bank.ts                 # Bank interior (next)
├── hooks/
│   ├── useForceDarkMode.ts     # Forces dark class on <html>
│   └── useGridRunner.ts        # Main game reducer + hook
└── ui/
    ├── screens/
    │   ├── TitleScreen.tsx      # Name input, new/continue
    │   ├── OverworldScreen.tsx  # Fixed 16x12 viewport renderer
    │   ├── BattleScreen.tsx     # Side-view battle UI
    │   ├── DiscScreen.tsx       # Identity Disc encyclopedia (future)
    │   └── IntelScreen.tsx      # Post-boss intel (future)
    └── hud/
        ├── DPad.tsx             # D-pad
        ├── ActionButtons.tsx    # A/B buttons
        └── GameControls.tsx     # Controls footer bar (all screens)
```

### 12.2 Key Technical Decisions

- **GameShell headless mode** for badge integration only
- **Route in GAME_ROUTES** (Layout.tsx) for full-viewport, no footer, no logo
- **Circuit background stays visible** behind the game
- **Forced dark mode** via `useForceDarkMode` hook
- **Self-hosted fonts** (Orbitron, Share Tech Mono) in `public/fonts/`, no CSP changes
- **Fixed 16x12 viewport** with `fitGrid()` via ResizeObserver for square tiles
- **Auto-enter/exit** buildings on step (Pokemon-style)
- **Save to `dis-gridrunner-save`**, badges to shared `dis-games-state`

### 12.3 Rendering Strategy

React DOM + CSS Grid. No canvas. The `fitGrid()` function measures the container and computes explicit pixel dimensions so tiles are always square. The same 16x12 grid is always rendered — smaller maps get void tiles, larger maps get camera panning.

### 12.4 Responsive Design

- **Controls visible everywhere:** D-pad + A/B buttons in a footer bar inside the frame on ALL screen sizes. Game Boy aesthetic -- the controls are part of the visual identity, not just a mobile fallback.
- **Desktop:** Keyboard (WASD/arrows, Enter/Space) as primary input. Controls clickable as secondary.
- **Mobile:** Controls are primary input. Touch targets 44px minimum.
- **Safe area:** Shell respects `env(safe-area-inset-*)`.

---

## 13. Save System

- Auto-save on zone transitions, battle completion, level up, every 60 seconds.
- V1: Single save slot. "New Game" overwrites.
- Key: `dis-gridrunner-save`

---

## 14. Audio

Not in V1 prototype. Ships in V4/V5. Full design spec here so it doesn't get lost.

### 14.1 Aesthetic

Daft Punk / Tron: Legacy soundtrack inspired. Dark synthwave, arpeggiated sequences, deep bass, clean digital textures. NOT chiptune 8-bit bleeps -- that's the wrong era. The audio should feel like the visual aesthetic: polished, atmospheric, modern-retro.

### 14.2 Music Tracks

| Context                          | Mood                         | Description                                                                                                                                                  |
| -------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Title screen**                 | Ambient, anticipation        | Slow arpeggiated pad, low pulse, building tension                                                                                                            |
| **Overworld**                    | Exploration, calm confidence | Mid-tempo synthwave loop, melodic lead, steady bass. The "walking around town" track.                                                                        |
| **Building interior (general)**  | Tension, alertness           | Darker variant of overworld. More minor key, subtle urgency. Encounter could trigger any step.                                                               |
| **Building interior (per zone)** | Zone-themed                  | Each zone gets a variant. Bank = clean/corporate undertone. Power Plant = industrial hum. Embassy = spy thriller tension. Research Lab = clinical precision. |
| **Battle (random encounter)**    | High energy, action          | Up-tempo synthwave. Driving beat, aggressive arpeggios, builds across the fight.                                                                             |
| **Battle (boss)**                | Epic, threatening            | Heavier than random encounter. Per-boss theme variations. Lazarus gets a chaotic, glitchy feel. Sandworm gets industrial. Cozy Bear gets slow-burn dread.    |
| **Battle (final boss)**          | Full orchestral synth        | Everything combined. All previous musical motifs referenced. The payoff track.                                                                               |
| **Victory**                      | Triumphant, brief            | Short 4-8 bar fanfare after winning a battle. Neon green energy.                                                                                             |
| **Defeat**                       | Somber, brief                | Short descending phrase. Not punishing -- a setback, not a funeral.                                                                                          |
| **Level up**                     | Ascending, rewarding         | Quick 2-bar ascending arpeggio with shimmer.                                                                                                                 |
| **Loot drop**                    | Satisfying, varies by rarity | Higher rarity = more elaborate chime. Legendary gets a distinct stinger.                                                                                     |
| **Intel report**                 | Reflective, informational    | Ambient pad, slow. Lets the player read without distraction.                                                                                                 |
| **Arcade Jukebox**               | Easter egg                   | Cycles through 3-4 short synthwave loops when player interacts. Flavor, not gameplay.                                                                        |

### 14.3 Sound Effects

| Event                       | Sound                                   |
| --------------------------- | --------------------------------------- |
| Player movement (step)      | Soft grid pulse / electronic footstep   |
| Building enter/exit         | Door whoosh + grid dissolve             |
| Encounter trigger           | CRT static burst / glitch hit           |
| Tool use (Recon)            | Scanning sweep / radar ping             |
| Tool use (Exploit)          | Sharp digital strike / data burst       |
| Tool use (Defense)          | Shield hum / barrier deploy             |
| Tool use (Persistence)      | Low drone / lock click                  |
| Hit (damage dealt)          | Impact crunch + neon flash              |
| Miss                        | Whiff / static fizzle                   |
| Critical hit                | Amplified impact + glass shatter        |
| Enemy defeated              | Derez sound (Tron: Legacy disc shatter) |
| HP low warning              | Heartbeat pulse, increasing tempo       |
| Tool locked (status effect) | Error buzz / access denied              |
| Energy drain                | Power-down descending tone              |
| XP gained                   | Soft ascending chime                    |
| Bits collected              | Coin clink (digital)                    |
| Menu open/close             | UI click / subtle whoosh                |

### 14.4 Implementation

- **Library:** Tone.js for synthesized sounds (no audio file downloads, small bundle, no CDN). Alternatively, prerender tracks as small mp3/ogg in `public/audio/`.
- **User mute toggle:** Persistent in save state. Defaults to ON with volume at 50%.
- **Browser autoplay policy:** Audio context created on first user interaction (tap/click/keypress). No autoplay on load.
- **Accessibility:** All audio is supplementary. No gameplay information is audio-only. Muting the game must not disadvantage the player.
- **Performance:** Lazy-load audio assets. Don't block game rendering on audio.

---

## 15. Prototype Scope (V1)

### Ships

- Title screen with name input, new game / continue
- Overworld with 14 buildings visible (2 accessible, 12 locked)
- Arcade interior: tutorial encounter, shop, save terminal
- Bank interior: encounters + Lazarus Group boss
- 2 random encounter enemy types (Script Kiddie, Ransomware Bot)
- 1 boss (Lazarus Group)
- 12 base tool types with rarity/stat roll system
- Turn-based battle with type effectiveness
- XP / leveling (cap at 20 for prototype)
- Bits economy + shop
- 4 prototype badges
- Auto-save to localStorage
- Mobile responsive with D-pad + A/B buttons
- Fixed 16x12 viewport with square tiles
- Self-hosted fonts (Orbitron, Share Tech Mono)
- Forced dark mode

### Doesn't Ship Yet

- Buildings 2-13 interiors
- Bosses 2-13
- Loot drops, prefixes, suffixes
- Credits (premium currency)
- Audio
- Visual art pass (building art, sprites, effects)
- CRT/glitch transitions

---

## 16. Roadmap

### V2: First Four Zones

- Hospital, Power Plant, Port Authority interiors + bosses (APT33, Sandworm, APT40)
- 3 additional random encounter types (Hacktivist, Insider Threat, Phishing Drone)
- Post-battle intel reports
- Loot drops with rarity rolls
- Tool scrapping for Bits

### V3: Zones 5-8 + Skill Grid

- University, Oil Refinery, Telecom Tower, Gov Building (Kimsuky, APT34, APT10, APT28)
- Skill grid Phase 1: Cyber Kill Chain branches, core node unlocks
- MITRE ATT&CK technique mapping for grid nodes
- Attack chains (Recon → Exploit → Persistence sequencing)
- Level cap to 30

### V4: Endgame Zones + Monetization

- Data Center, Satellite Station, Embassy, Research Lab, Grid Core (APT41, Turla, Cozy Bear, Equation Group, The Alliance)
- Skill grid Phase 2: Boss-specific technique requirements, full chain unlocks
- Level cap to 40
- Multi-phase boss mechanics
- Stripe integration, Credits live
- Loot crates, cosmetics

### V5: Polish + Social

- Visual art pass (building art, player sprite, enemy sprites)
- CRT/glitch transition effects
- Audio (synthwave BGM, SFX)
- Leaderboards, badge sharing
- Server-side saves for paying users

### V6: Live

- Multiplayer PvP (way out)
- Legendary set bonuses
- New zones / seasonal APT content

---

## 17. Resolved Decisions

- **Map viewport:** Fixed 16x12 tile viewport always. Smaller maps centered with void tiles. Larger maps pan a camera window. Tile size identical across all maps.
- **Overworld growth:** Yes, the overworld grows as zones are added. Camera panning handles it. The game world should feel like Zelda/Pokemon/Legend of Legaia -- explorable, not confined to one screen.
- **Building entry/exit:** Auto-enter on step, auto-exit on step. Pokemon-style. No button press.
- **Encounter tiles:** Visually distinct (pulsing/corrupted) per GDD 4.5, with 25-35% RNG per step. Overworld has zero encounters.
- **Visual aesthetic:** Tron: Legacy (2010). Sleek black surfaces, thin luminous edge lines, geometric architecture.
- **Dark mode:** Forced via useForceDarkMode hook. No light mode.
- **Fonts:** Self-hosted (Orbitron, Share Tech Mono) in public/fonts/. No CDN.
- **Re-fighting bosses:** Allowed with reduced XP/Bits. Both a cooldown AND a daily limit.
- **Boss progression variety:** Nations are interleaved. The progression tells a coherent global story, not random zones stitched together.
- **Tool scrapping:** Yes, scrapping unwanted tools yields Bits. Rate per rarity TBD during balancing.
- **Controls visible everywhere:** D-pad + A/B buttons render on ALL screen sizes, not just mobile. The Game Boy frame aesthetic requires the controls to be part of the visual identity. On desktop they're clickable as secondary input alongside keyboard. On mobile they're primary input. Only hidden on the title screen.
- **Combat system:** Pokemon-style turn-based. Fundamental. Does not change.
- **Progression system:** FFX Sphere Grid model for skill/technique acquisition (see section 5.5). Mapped to MITRE ATT&CK and the Cyber Kill Chain. Combat stays Pokemon. The grid adds strategic depth to how capabilities are built and chained.

## 18. Open Questions

1. **Encounter rate tuning:** 25-35% per step on encounter tiles. Needs playtesting.
2. **Tool scrap rates:** How many Bits per rarity tier? Needs economy balancing.
3. **Equation Group no-weakness:** Neutral damage across all types at level 38. Playtesting needed.
4. **The Alliance adaptive phase:** "Resist the last type used" forces type rotation. Playtesting needed.
5. **Skill grid scope:** Full grid design is a major undertaking. How much ships in V3 vs V4?
6. **Overworld layout for 14 buildings:** Multiple connected screens or one large panning map?

---

## 19. Reference / Inspiration

- **Pokemon (Red/Blue/Gold)** — Overworld + battle transitions, random encounters, gym progression, auto-enter/exit buildings on step
- **Final Fantasy X** — Sphere Grid progression model. Skill tree where nodes map to real capabilities, unlocked by zone completion and boss defeats. NOT the combat system (that's Pokemon). The grid structure, node-based unlocks, and branching paths are the FFX influence.
- **Diablo II / III** — Loot rarity tiers, randomized stat rolls, prefix/suffix system, grind loop, inventory management
- **Tron: Legacy (2010)** — Primary visual aesthetic. Sleek black surfaces, thin luminous edge lines, geometric architecture, identity disc glow, light cycle trails. Darker and more refined than the 1982 original.
- **Game Boy / GBA** — Frame model. Fixed game viewport with controls inside the frame, consistent tile size, the whole game fits in one screen. D-pad + A/B button layout.
- **Civilization** — Nation-state theme, progression through geopolitical powers
- **MITRE ATT&CK** — Real-world APT group data, TTPs, nation-state attribution. Skill grid nodes map to actual ATT&CK technique IDs.
- **Lockheed Martin Cyber Kill Chain** — Seven-phase attack model (Recon through Actions on Objectives) structures the skill grid branches.
- **Legend of Legaia / Zelda / Link's Awakening** — Overworld exploration model. World grows as you progress, camera pans, buildings and areas unlock. Not confined to one screen.
- **Hacknet / Uplink** — Hacking game feel (but more accessible, less simulation)
- **Linux terminal** — Rolling log aesthetic for game events, battle output, zone transitions. Persistent terminal-style output visible across screens.
- **Digital House (DIS)** — Sibling awareness game, shared badge ecosystem, art style reference for cutaway building interiors

---

_Copyright (c) 2026 Defend I.T. Solutions LLC. All Rights Reserved._
