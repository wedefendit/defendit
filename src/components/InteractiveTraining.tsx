import Link from "next/link";

type GameCard = Readonly<{
  href: string;
  title: string;
  description: string;
  badge: string;
  meta: string;
  thumbnail: React.ReactNode;
  comingSoon?: boolean;
  demo?: boolean;
}>;

function HouseThumbnail() {
  return (
    <svg
      viewBox="0 0 140 110"
      width="140"
      height="110"
      aria-hidden
      className="drop-shadow-md"
    >
      <polygon points="70,12 16,50 124,50" fill="#4a5568" />
      <rect x="94" y="22" width="10" height="18" fill="#5d4a38" />
      <rect x="92" y="20" width="14" height="4" fill="#4a3c30" />
      <rect x="18" y="50" width="104" height="50" fill="#6b5744" />
      <rect x="22" y="54" width="48" height="20" fill="#d4c4a0" />
      <rect x="72" y="54" width="48" height="20" fill="#ccc4b4" />
      <rect x="20" y="75" width="102" height="3" fill="#4a3c30" />
      <rect x="22" y="79" width="48" height="19" fill="#d4c4a0" />
      <rect x="72" y="79" width="48" height="19" fill="#ddd8d0" />
      <rect x="18" y="100" width="104" height="5" fill="#2e261f" />
      <rect x="90" y="84" width="12" height="14" fill="#5d4a38" />
      <circle cx="100" cy="92" r="1" fill="#d4a84b" />
      <rect x="34" y="60" width="8" height="6" fill="#38bdf8" opacity="0.4" />
      <rect x="50" y="60" width="8" height="6" fill="#38bdf8" opacity="0.4" />
      <rect x="84" y="60" width="8" height="6" fill="#a78bfa" opacity="0.4" />
      <rect x="100" y="60" width="8" height="6" fill="#a78bfa" opacity="0.4" />
    </svg>
  );
}

function GridRunnerThumbnail() {
  return (
    <svg
      viewBox="0 0 140 110"
      width="140"
      height="110"
      aria-hidden
      className="drop-shadow-md"
    >
      <rect x="0" y="0" width="140" height="110" fill="#0a0e1a" rx="4" />
      <line
        x1="0"
        y1="22"
        x2="140"
        y2="22"
        stroke="#1a3a4a"
        strokeWidth="0.5"
      />
      <line
        x1="0"
        y1="44"
        x2="140"
        y2="44"
        stroke="#1a3a4a"
        strokeWidth="0.5"
      />
      <line
        x1="0"
        y1="66"
        x2="140"
        y2="66"
        stroke="#1a3a4a"
        strokeWidth="0.5"
      />
      <line
        x1="0"
        y1="88"
        x2="140"
        y2="88"
        stroke="#1a3a4a"
        strokeWidth="0.5"
      />
      <line
        x1="28"
        y1="0"
        x2="28"
        y2="110"
        stroke="#1a3a4a"
        strokeWidth="0.5"
      />
      <line
        x1="56"
        y1="0"
        x2="56"
        y2="110"
        stroke="#1a3a4a"
        strokeWidth="0.5"
      />
      <line
        x1="84"
        y1="0"
        x2="84"
        y2="110"
        stroke="#1a3a4a"
        strokeWidth="0.5"
      />
      <line
        x1="112"
        y1="0"
        x2="112"
        y2="110"
        stroke="#1a3a4a"
        strokeWidth="0.5"
      />
      <rect
        x="54"
        y="42"
        width="8"
        height="8"
        fill="#00f0ff"
        opacity="0.9"
        rx="1"
      />
      <rect
        x="82"
        y="64"
        width="8"
        height="8"
        fill="#ff003c"
        opacity="0.7"
        rx="1"
      />
      <rect
        x="26"
        y="64"
        width="8"
        height="8"
        fill="#ff003c"
        opacity="0.5"
        rx="1"
      />
      <circle
        cx="58"
        cy="46"
        r="12"
        fill="none"
        stroke="#00f0ff"
        strokeWidth="0.5"
        opacity="0.3"
      />
      <text
        x="70"
        y="104"
        textAnchor="middle"
        fill="#00f0ff"
        fontSize="6"
        fontFamily="monospace"
        opacity="0.5"
      >
        GRIDRUNNER
      </text>
    </svg>
  );
}

function PhishTankThumbnail() {
  return (
    <svg
      viewBox="0 0 140 110"
      width="140"
      height="110"
      aria-hidden
      className="drop-shadow-md"
    >
      <rect x="0" y="0" width="140" height="110" fill="#0f1729" rx="4" />
      <rect x="20" y="16" width="100" height="14" fill="#1e293b" rx="3" />
      <rect x="24" y="20" width="60" height="6" fill="#334155" rx="2" />
      <circle cx="112" cy="23" r="4" fill="#22c55e" opacity="0.6" />
      <rect x="20" y="38" width="100" height="52" fill="#1e293b" rx="3" />
      <text
        x="70"
        y="56"
        textAnchor="middle"
        fill="#94a3b8"
        fontSize="7"
        fontFamily="sans-serif"
      >
        From: support@bankk.com
      </text>
      <text
        x="70"
        y="68"
        textAnchor="middle"
        fill="#64748b"
        fontSize="5.5"
        fontFamily="sans-serif"
      >
        Your account has been locked.
      </text>
      <text
        x="70"
        y="76"
        textAnchor="middle"
        fill="#64748b"
        fontSize="5.5"
        fontFamily="sans-serif"
      >
        Click here to verify your identity.
      </text>
      <rect
        x="48"
        y="82"
        width="44"
        height="10"
        fill="#ef4444"
        opacity="0.8"
        rx="2"
      />
      <text
        x="70"
        y="89"
        textAnchor="middle"
        fill="#fff"
        fontSize="5"
        fontFamily="sans-serif"
        fontWeight="bold"
      >
        PHISH?
      </text>
    </svg>
  );
}

const GAMES: GameCard[] = [
  {
    href: "/awareness/digital-house",
    title: "The Digital House",
    description:
      "Place devices into rooms and see how trust, exposure, and recovery shift as you design your home network.",
    badge: "New",
    meta: "Game · 5 min",
    thumbnail: <HouseThumbnail />,
  },
  {
    href: "/awareness/gridrunner",
    title: "GRIDRUNNER",
    description:
      "Navigate cyberspace as a cyber operator. Battle real-world threat actors and collect security tools.",
    badge: "Demo",
    meta: "RPG · 20-25 min",
    thumbnail: <GridRunnerThumbnail />,
    demo: true,
  },
  {
    href: "/awareness",
    title: "Phish Tank",
    description:
      "Spot the phishing email before time runs out. Learn the red flags that give away social engineering attacks.",
    badge: "Coming Soon",
    meta: "Quiz · 3 min",
    thumbnail: <PhishTankThumbnail />,
    comingSoon: true,
  },
];

const cardBase =
  "group relative overflow-hidden rounded-2xl border p-5 text-left backdrop-blur-md transition-all";
const cardActive =
  "border-slate-200/80 bg-white/78 shadow-[0_16px_38px_rgba(15,23,42,0.08)] ring-1 ring-white/70 hover:-translate-y-0.5 hover:shadow-[0_22px_48px_rgba(15,23,42,0.14)] dark:border-sky-400/18 dark:bg-slate-950/74 dark:shadow-[0_22px_48px_rgba(2,6,23,0.36)] dark:ring-white/5 dark:hover:border-sky-400/35";
const cardDisabled =
  "border-slate-200/40 bg-white/40 shadow-none ring-1 ring-white/30 dark:border-slate-700/40 dark:bg-slate-950/40 dark:ring-white/5";

function TrainingCard({ card }: Readonly<{ card: GameCard }>) {
  const inner = (
    <>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.07),transparent_60%)] dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.14),transparent_60%)]" />
      {card.demo && (
        <div className="pointer-events-none absolute right-3 top-3 z-10 rotate-6 select-none">
          <span className="inline-block rounded-sm border-[2.5px] border-red-600/85 px-2.5 py-0.5 text-xs font-black uppercase tracking-[0.2em] text-red-600/85 dark:border-red-400/90 dark:text-red-400/90">
            Demo
          </span>
        </div>
      )}
      <div className={`relative ${card.comingSoon ? "opacity-50" : ""}`}>
        <div className="mb-4 flex items-end justify-center rounded-xl border border-slate-200/60 bg-slate-100/60 p-4 dark:border-sky-900/40 dark:bg-slate-900/50">
          {card.thumbnail}
        </div>
        <div className="flex items-center gap-2">
          <span
            className={[
              "inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
              card.comingSoon
                ? "border-slate-300/60 bg-slate-100 text-slate-500 dark:border-slate-600/40 dark:bg-slate-800/50 dark:text-slate-400"
                : "border-sky-300/60 bg-sky-50 text-sky-700 dark:border-sky-500/40 dark:bg-sky-950/50 dark:text-sky-300",
            ].join(" ")}
          >
            {card.badge}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {card.meta}
          </span>
        </div>
        <h3 className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
          {card.title}
        </h3>
        <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">
          {card.description}
        </p>
        {!card.comingSoon && (
          <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-sky-600 dark:text-sky-400">
            Play
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </div>
        )}
        {card.comingSoon && (
          <div className="mt-4 text-sm font-semibold text-slate-400 dark:text-slate-500">
            In development
          </div>
        )}
      </div>
    </>
  );

  if (card.comingSoon) {
    return (
      <div className={`${cardBase} ${cardDisabled} cursor-default`}>
        {inner}
      </div>
    );
  }

  return (
    <Link href={card.href} className={`${cardBase} ${cardActive}`}>
      {inner}
    </Link>
  );
}

export function InteractiveTraining() {
  return (
    <section
      className="pt-6 sm:pt-8 first:pt-0 border-t border-gray-200/60 dark:border-gray-700/60 first:border-t-0"
      aria-labelledby="interactive-training"
    >
      <div className="mb-5 text-center">
        <h2
          id="interactive-training"
          className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white"
        >
          Interactive Training
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
          Hands-on exercises that teach one core security idea at a time. Play
          at your own pace. No sign-in required.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GAMES.map((game) => (
          <TrainingCard key={game.title} card={game} />
        ))}
      </div>
    </section>
  );
}
