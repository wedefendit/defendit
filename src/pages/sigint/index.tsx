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
import {
  Globe,
  Radar,
  Layers,
  Radio,
  Shield,
  Satellite,
  AlertTriangle,
  Newspaper,
  Eye,
  Flame,
  CloudLightning,
  Ship,
  Plane,
  Activity,
  Zap,
  ArrowRight,
  Monitor,
  Lock,
  Check,
  Github,
  Bell,
  MapPin,
  Database,
  Users,
  Brain,
  User,
} from "lucide-react";
import Image from "next/image";
import { Meta, PageContainer } from "@/components";
import JsonLdScript from "@/components/JsonLdScript";
import { sigintProductLd, generateBreadCrumbJsonLd } from "@/lib/json-ld";
import { WaitlistForm } from "@/components/WaitlistForm";

/* ── tiny helpers ─────────────────────────────────────────────────── */
function SectionTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block text-xs font-bold tracking-[0.25em] uppercase text-blue-600 dark:text-sky-400 mb-3">
      {children}
    </span>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
      {children}
    </h2>
  );
}

/* ── data source card ─────────────────────────────────────────────── */
type SourceCardProps = {
  icon: React.ReactNode;
  name: string;
  description: string;
  badge?: string;
  badgeColor?: string;
};

function SourceCard({
  icon,
  name,
  description,
  badge,
  badgeColor = "bg-sky-500/20 text-sky-300",
}: SourceCardProps) {
  return (
    <div className="group relative flex items-start gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700/50 bg-white/60 dark:bg-gray-900/40 hover:bg-blue-50 dark:hover:bg-slate-800/50 hover:border-blue-500 dark:hover:border-sky-500 transition-all">
      <div className="flex-shrink-0 w-10 h-10 rounded-md bg-blue-100 dark:bg-sky-500/10 flex items-center justify-center text-blue-600 dark:text-sky-400 group-hover:text-blue-500 dark:group-hover:text-sky-300 transition-colors">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            {name}
          </h3>
          {badge && (
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${badgeColor}`}
            >
              {badge}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

/* ── capability card ──────────────────────────────────────────────── */
type CapCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

function CapCard({ icon, title, description }: CapCardProps) {
  return (
    <div className="group p-6 rounded-lg border border-gray-200 dark:border-gray-700/50 bg-white/50 dark:bg-gray-900/30 hover:bg-blue-50 dark:hover:bg-slate-800/50 hover:border-blue-500 dark:hover:border-sky-500 transition-all">
      <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-sky-500/10 flex items-center justify-center text-blue-600 dark:text-sky-400 mb-4 group-hover:bg-blue-200 dark:group-hover:bg-sky-500/20 group-hover:scale-110 transition-all">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

/* ── stat counter ─────────────────────────────────────────────────── */
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl sm:text-4xl font-bold text-blue-600 dark:text-sky-400 font-mono">
        {value}
      </div>
      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}

/* ── main page ────────────────────────────────────────────────────── */
export default function SigintPage() {
  return (
    <>
      <Meta
        title="SIGINT Dashboard™ | Real-Time OSINT Intelligence Platform"
        description="Track aircraft, ships, earthquakes, fires, weather, and conflict events on a live interactive globe. Free to self-host. Correlation engine, anomaly detection, and scored alerts across 7+ live data sources."
        image="https://www.wedefendit.com/sigint-og.png"
        imageAlt="SIGINT Dashboard showing live globe with 60,000+ tracked entities, alert scoring, intel feed, and video monitoring"
        url="https://www.wedefendit.com/sigint"
        canonical="https://www.wedefendit.com/sigint"
        keywords="OSINT dashboard, SIGINT, real-time intelligence, aircraft tracking, AIS vessel tracking, earthquake monitoring, fire detection, GDELT, FIRMS, NOAA weather, live globe, situational awareness, threat detection, anomaly detection, correlation engine, open source intelligence, self-hosted OSINT"
        structuredData={sigintProductLd}
      />
      <JsonLdScript
        jsonLd={generateBreadCrumbJsonLd({
          items: [{ name: "Home", href: "/" }, { name: "SIGINT Dashboard" }],
        })}
      />

      <PageContainer>
        <div className="w-full max-w-6xl mx-auto px-4 space-y-20 pb-16">
          {/* ── Hero ──────────────────────────────────────────────── */}
          <header className="text-center pt-4 px-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-medium mb-6">
              <Radar className="w-3.5 h-3.5" />
              <span>OSINT LIVE FEED PLATFORM</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.05] text-gray-900 dark:text-white mb-6">
              <span className="text-blue-600 dark:text-sky-400">
                SIGINT Dashboard&trade;
              </span>
              <span className="block text-xl sm:text-2xl md:text-4xl font-medium text-gray-700 dark:text-gray-300 mt-3">
                Global Intelligence at a Glance
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
              Real-time situational awareness across multiple live data sources.
              Aircraft, ships, earthquakes, fires, conflict events, weather
              alerts, and world news. Correlated, scored, and rendered on an
              interactive globe.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 mb-4">
              <WaitlistForm tier="pro" className="w-full max-w-lg" />
              <a
                href="https://sigint-5154d935429b.herokuapp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg border border-green-500/40 dark:border-green-500/30 hover:border-green-500 dark:hover:border-green-400 bg-green-500/5 hover:bg-green-500/10 text-gray-700 dark:text-green-300 hover:text-gray-900 dark:hover:text-green-200 text-lg font-medium transition-all"
              >
                <Globe className="w-5 h-5" />
                Live Demo
              </a>
            </div>
            <a
              href="#capabilities"
              className="inline-flex items-center gap-2 text-blue-600 dark:text-sky-400 hover:text-blue-500 dark:hover:text-sky-300 text-sm font-medium transition-colors mb-12"
            >
              Learn More
              <ArrowRight className="w-4 h-4" />
            </a>

            {/* Hero screenshot */}
            <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700/50 shadow-2xl shadow-black/50">
              <Image
                src="/sigint-hero.png"
                alt="SIGINT dashboard showing live globe with 64,000+ tracked entities, alert log, intel feed, news feed, and video monitoring"
                width={1920}
                height={1080}
                className="w-full h-auto"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  LIVE
                </span>
                <span>64,354 tracks</span>
                <span>All sources active</span>
              </div>
            </div>
          </header>

          {/* ── Stats bar ─────────────────────────────────────────── */}
          <section className="grid grid-cols-2 sm:grid-cols-4 gap-8 py-8 border-y border-gray-200 dark:border-gray-700/50">
            <Stat value="60K+" label="Live Tracks" />
            <Stat value="7+" label="Data Sources" />
            <Stat value="<4min" label="Refresh Cycle" />
            <Stat value="24/7" label="Monitoring" />
          </section>

          {/* ── Data Sources ──────────────────────────────────────── */}
          <section>
            <div className="text-center mb-10">
              <SectionTag>Intelligence Sources</SectionTag>
              <SectionTitle>Live Data Feeds. One Dashboard.</SectionTitle>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Every source is fetched, parsed, cached, and rendered
                automatically. No manual imports. Open the dashboard and watch
                the world.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <SourceCard
                icon={<Plane className="w-5 h-5" />}
                name="Aircraft Tracking"
                description="Live global aircraft positions from OpenSky Network. Callsign, altitude, speed, heading, squawk codes. Military aircraft classification and emergency detection."
                badge="LIVE"
                badgeColor="bg-green-500/20 text-green-300"
              />
              <SourceCard
                icon={<Ship className="w-5 h-5" />}
                name="AIS Vessel Tracking"
                description="Real-time global vessel positions via AIS stream. MMSI, IMO, type, flag, destination, navigation status. WebSocket streaming for near-zero latency."
                badge="LIVE"
                badgeColor="bg-green-500/20 text-green-300"
              />
              <SourceCard
                icon={<Activity className="w-5 h-5" />}
                name="Seismic Monitoring"
                description="USGS earthquake data covering the past 7 days. Magnitude, depth, tsunami alerts, felt reports. Pulse rendering scales with magnitude."
              />
              <SourceCard
                icon={<Flame className="w-5 h-5" />}
                name="Fire Detection"
                description="NASA FIRMS VIIRS satellite fire hotspot data. Fire radiative power, brightness temperature, confidence levels. 30K–100K+ detections per day globally."
              />
              <SourceCard
                icon={<AlertTriangle className="w-5 h-5" />}
                name="Conflict & Crisis Events"
                description="GDELT 2.0 geolocated news events. Conflict, protests, diplomatic actions scored by severity. 15-minute server-side polling with 7-day rolling window."
              />
              <SourceCard
                icon={<CloudLightning className="w-5 h-5" />}
                name="Severe Weather Alerts"
                description="NOAA National Weather Service active severe weather alerts. Severity classification, area descriptions, onset/expiry tracking."
              />
              <SourceCard
                icon={<Newspaper className="w-5 h-5" />}
                name="World News Aggregation"
                description="RSS feeds from Reuters, NYT, BBC, Al Jazeera, The Guardian, and NPR. Stay informed alongside your data without switching tabs."
              />
            </div>
          </section>

          {/* ── Capabilities ──────────────────────────────────────── */}
          <section id="capabilities">
            <div className="text-center mb-10">
              <SectionTag>Capabilities</SectionTag>
              <SectionTitle>
                More Than a Map. An Intelligence Workstation.
              </SectionTitle>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                SIGINT correlates, scores, and surfaces what matters. Less
                noise, faster understanding.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <CapCard
                icon={<Globe className="w-6 h-6" />}
                title="Interactive Globe & Flat Map"
                description="Switch between 3D globe and flat map projections. Smooth animations, trail rendering, and zoom from global overview down to street level with 60K+ tracks."
              />
              <CapCard
                icon={<Radar className="w-6 h-6" />}
                title="Correlation Engine"
                description="Automatically connects events across sources. Conflict near a fire? Earthquake followed by secondary fires? Military aircraft near a crisis zone? SIGINT finds it."
              />
              <CapCard
                icon={<Eye className="w-6 h-6" />}
                title="Anomaly Detection"
                description="Learns what's normal for each region over time. A M3.5 in Virginia scores higher than a M5 in Chile because Virginia has no seismic baseline."
              />
              <CapCard
                icon={<Layers className="w-6 h-6" />}
                title="Multi-Pane Layout"
                description="Split, resize, drag, minimize, and save layout presets. Run the globe, data table, dossier, intel feed, alert log, video, news, and console all at once."
              />
              <CapCard
                icon={<Monitor className="w-6 h-6" />}
                title="Live Video Monitoring"
                description="Stream live news from thousands of channels. Grid layouts up to 3x3, saved presets, and one-click channel switching."
              />
              <CapCard
                icon={<Satellite className="w-6 h-6" />}
                title="Watch Mode"
                description="Hands-free tour of high-priority events. The globe cycles through scored alerts, syncing every pane automatically."
              />
              <CapCard
                icon={<Shield className="w-6 h-6" />}
                title="Entity Dossier"
                description="Click any track for the full picture. Aircraft photos, routes, vessel details, seismic data, and links to external intelligence sources."
              />
              <CapCard
                icon={<Radio className="w-6 h-6" />}
                title="Alert Scoring"
                description="Every alert gets a 1-10 composite score based on severity, regional context, cross-source correlation, and military classification."
              />
              <CapCard
                icon={<Lock className="w-6 h-6" />}
                title="Secure by Default"
                description="Token-authenticated API, encrypted cookies, per-IP rate limiting. Every route is protected out of the box."
              />
            </div>
          </section>

          {/* ── Screenshots ───────────────────────────────────────── */}
          <section>
            <div className="text-center mb-10">
              <SectionTag>In Action</SectionTag>
              <SectionTitle>See What SIGINT Sees</SectionTitle>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Real screenshots from live sessions, not mockups. Every data
                point, alert, and video feed is real.
              </p>
            </div>

            <div className="space-y-12">
              {/* Emergency detection */}
              <div className="grid md:grid-cols-5 gap-6 items-center">
                <div className="md:col-span-3 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700/50 shadow-xl">
                  <Image
                    src="/sigint-emergency.png"
                    alt="SIGINT detecting a 7700 emergency squawk with trail tracking, dossier, and live video feeds"
                    width={1920}
                    height={1080}
                    className="w-full h-auto"
                  />
                </div>
                <div className="md:col-span-2 space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-red-500/15 text-red-400 text-xs font-bold">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    EMERGENCY DETECTION
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Squawk 7700: Instant Alert
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    A Gulfstream G550 declares emergency over Texas. SIGINT
                    picks up the squawk, scores the alert, renders the full
                    trail, and pulls the aircraft dossier with identity,
                    telemetry, route, and intel links. Four live news streams
                    running alongside.
                  </p>
                </div>
              </div>

              {/* Hijack + trail */}
              <div className="grid md:grid-cols-5 gap-6 items-center">
                <div className="md:col-span-2 space-y-3 order-2 md:order-1">
                  <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-purple-500/15 text-purple-400 text-xs font-bold">
                    <Plane className="w-3.5 h-3.5" />
                    TRAIL TRACKING
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Squawk 7500: Route Reconstruction
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    American Airlines A321 squawking hijack. Trail shows every
                    recorded position with interpolated waypoints. Dossier pulls
                    a photo from Planespotters, displays available route info,
                    and provides LOCATE/FOCUS/SOLO isolation controls.
                  </p>
                </div>
                <div className="md:col-span-3 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700/50 shadow-xl order-1 md:order-2">
                  <Image
                    src="/sigint-hijack-trail.png"
                    alt="SIGINT tracking a squawk 7500 hijack code with trail rendering and aircraft dossier with photo"
                    width={1920}
                    height={1080}
                    className="w-full h-auto"
                  />
                </div>
              </div>

              {/* GDELT events */}
              <div className="grid md:grid-cols-5 gap-6 items-center">
                <div className="md:col-span-3 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700/50 shadow-xl">
                  <Image
                    src="/sigint-gdelt.png"
                    alt="SIGINT showing GDELT crisis event detail with 60K tracks, video feeds, alerts, and intel feed"
                    width={1920}
                    height={1080}
                    className="w-full h-auto"
                  />
                </div>
                <div className="md:col-span-2 space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-sky-500/15 text-sky-400 text-xs font-bold">
                    <Globe className="w-3.5 h-3.5" />
                    SITUATIONAL AWARENESS
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    60K+ Tracks, One Screen
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    Globe view with 60,000+ live entities. A GDELT crisis event
                    selected showing headline, severity, tone, and source. Four
                    live video feeds streaming. 546 active alerts. 28,000+
                    correlated intel items.
                  </p>
                </div>
              </div>

              {/* Hijack dossier */}
              <div className="grid md:grid-cols-5 gap-6 items-center">
                <div className="md:col-span-2 space-y-3 order-2 md:order-1">
                  <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-amber-500/15 text-amber-400 text-xs font-bold">
                    <Eye className="w-3.5 h-3.5" />
                    ENTITY DOSSIER
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Full Aircraft Intelligence
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    Allegiant Air A319 squawking 7500. Dossier shows full
                    identity (callsign, ICAO24, type, registration, operator,
                    manufacturer), live telemetry at 28,750 ft and 494 kn, and
                    available route information. Intel links to FlightAware,
                    FR24, and ADS-B Exchange.
                  </p>
                </div>
                <div className="md:col-span-3 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700/50 shadow-xl order-1 md:order-2">
                  <Image
                    src="/sigint-hijack-dossier.png"
                    alt="SIGINT aircraft dossier showing full identity, telemetry, route details for a squawk 7500 aircraft"
                    width={1920}
                    height={1080}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ── Tech Stack ────────────────────────────────────────── */}
          <section className="py-10 px-6 rounded-lg border border-gray-200 dark:border-gray-700/50 bg-white/50 dark:bg-gray-900/30">
            <div className="text-center mb-8">
              <SectionTag>Under the Hood</SectionTag>
              <SectionTitle>Built for Performance</SectionTitle>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  60K+
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Simultaneous tracks rendered smoothly. Rendering runs on a
                  separate thread so the UI stays smooth.
                </p>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  Single Deploy
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  One process serves everything. No microservices, no build
                  pipeline, no infrastructure sprawl.
                </p>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  Offline Ready
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Installable as a PWA. Cached data loads instantly on revisit,
                  even without a connection.
                </p>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  Open Stack
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Bun, React 19, Tailwind 4, Canvas 2D. No proprietary
                  dependencies. Self-host on anything.
                </p>
              </div>
            </div>
          </section>

          {/* ── Pricing ─────────────────────────────────────────── */}
          <section id="pricing">
            <div className="text-center mb-10">
              <SectionTag>Pricing</SectionTag>
              <SectionTitle>
                Run It Yourself. Or Let Us Run It For You.
              </SectionTitle>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                The full dashboard is free to self-host. Paid tiers add
                persistent infrastructure, geofenced alerts, and features that
                require a backend you don&apos;t have to maintain.
              </p>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
              {/* Community */}
              <div className="rounded-lg border border-gray-200 dark:border-gray-700/50 bg-white/50 dark:bg-gray-900/30 p-6 flex flex-col h-full hover:border-blue-500 dark:hover:border-green-500/30 hover:bg-blue-50 dark:hover:bg-gray-900/50 transition-all">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Github className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Community
                    </h3>
                  </div>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      Free
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Self-hosted. Your server, your API keys.
                  </p>
                </div>
                <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300 flex-1">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>All live data sources</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Correlation engine &amp; anomaly detection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>All 8 pane types including video &amp; news</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Watch mode, entity dossier, alert scoring</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>7-day rolling data window (browser-local)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Dark and light themes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>JSON export</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Web app (PWA installable)</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <a
                    href="https://github.com/iiTONELOC/sigint"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-sky-500 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-all"
                  >
                    View on GitHub
                  </a>
                </div>
              </div>

              {/* Individual */}
              <div className="rounded-lg border border-sky-500/40 bg-white/70 dark:bg-gray-900/50 p-6 flex flex-col h-full relative ring-1 ring-sky-500/20 hover:ring-sky-500/40 hover:bg-blue-50 dark:hover:bg-gray-900/70 transition-all">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-sky-500 text-xs font-bold text-white">
                  COMING SOON
                </div>
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-5 h-5 text-sky-400" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Individual
                    </h3>
                  </div>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      $29
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      /mo
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">
                    or $249/yr (save 28%)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Solo analyst. 5 devices. We handle the infrastructure.
                  </p>
                </div>
                <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300 flex-1">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-sky-400 mt-0.5 flex-shrink-0" />
                    <span>Everything in Community</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Monitor className="w-4 h-4 text-sky-400 mt-0.5 flex-shrink-0" />
                    <span>
                      Desktop app with native notifications &amp; tray
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Database className="w-4 h-4 text-sky-400 mt-0.5 flex-shrink-0" />
                    <span>90-day event history &amp; historical replay</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-sky-400 mt-0.5 flex-shrink-0" />
                    <span>Geofenced alerts with push &amp; email</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Bell className="w-4 h-4 text-sky-400 mt-0.5 flex-shrink-0" />
                    <span>Custom alert rules across all sources</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Radar className="w-4 h-4 text-sky-400 mt-0.5 flex-shrink-0" />
                    <span>90-day rolling anomaly baselines</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-sky-400 mt-0.5 flex-shrink-0" />
                    <span>Synced state across devices</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-sky-400 mt-0.5 flex-shrink-0" />
                    <span>CSV &amp; KML export</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <WaitlistForm tier="pro" stacked />
                </div>
              </div>

              {/* Team */}
              <div className="rounded-lg border border-violet-500/40 bg-white/70 dark:bg-gray-900/50 p-6 flex flex-col h-full relative ring-1 ring-violet-500/20 hover:ring-violet-500/40 hover:bg-blue-50 dark:hover:bg-gray-900/70 transition-all">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-violet-500 text-xs font-bold text-white">
                  COMING SOON
                </div>
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-violet-400" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Team
                    </h3>
                  </div>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      $34
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      /seat/mo
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-500 ml-1">
                      min 3 seats
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">
                    or $299/seat/yr (save 27%)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Small groups. Shared intelligence. 5 devices per seat.
                  </p>
                </div>
                <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300 flex-1">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
                    <span>Everything in Individual</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Layers className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
                    <span>Shared workspaces &amp; layout presets</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
                    <span>Shared geofences &amp; alert rules</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Radio className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
                    <span>Team annotations on events</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
                    <span>Role-based access (admin / analyst / viewer)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Users className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
                    <span>Invite &amp; manage team members</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <WaitlistForm tier="pro" stacked />
                </div>
              </div>

              {/* Enterprise */}
              <div className="rounded-lg border border-amber-500/30 bg-gradient-to-b from-amber-50 dark:from-amber-500/5 to-white/50 dark:to-gray-900/30 p-6 flex flex-col h-full relative hover:border-amber-500/50 hover:from-amber-100 dark:hover:from-amber-500/10 transition-all">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-amber-400" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Enterprise
                    </h3>
                  </div>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      Custom
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Dedicated instance. Your data, your rules.
                  </p>
                </div>
                <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300 flex-1">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span>Everything in Team</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Brain className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span>AI threat briefs, NL queries, daily digests</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Radio className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span>Custom data source integration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lock className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span>SSO &amp; on-prem deployment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Zap className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span>Full API access</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Database className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span>Unlimited data retention</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Eye className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span>Audit log with non-repudiation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span>SLA, dedicated support, compliance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Globe className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span>White-label &amp; custom branding</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <WaitlistForm tier="enterprise" stacked />
                </div>
              </div>
            </div>

            {/* Add-ons callout */}
            <div className="mt-10 rounded-lg border border-gray-200 dark:border-gray-700/50 bg-white/40 dark:bg-gray-900/20 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-5">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Add-ons
                </h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">
                  AVAILABLE ON INDIVIDUAL &amp; TEAM
                </span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="group flex items-start gap-3 p-3 rounded border border-gray-200 dark:border-gray-800/50 hover:border-blue-500 dark:hover:border-sky-500 hover:bg-blue-50 dark:hover:bg-sky-500/5 cursor-default transition-all">
                  <Newspaper className="w-4 h-4 text-sky-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-sm text-gray-900 dark:text-white font-medium">
                      Custom RSS feeds
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                      Add your own sources, fetched through our server
                    </p>
                  </div>
                </div>
                <div className="group flex items-start gap-3 p-3 rounded border border-gray-200 dark:border-gray-800/50 hover:border-blue-500 dark:hover:border-sky-500 hover:bg-blue-50 dark:hover:bg-sky-500/5 cursor-default transition-all">
                  <Satellite className="w-4 h-4 text-sky-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-sm text-gray-900 dark:text-white font-medium">
                      Premium data sources
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                      ADS-B Exchange, ACLED, and other paid feeds
                    </p>
                  </div>
                </div>
                <div className="group flex items-start gap-3 p-3 rounded border border-gray-200 dark:border-gray-800/50 hover:border-blue-500 dark:hover:border-sky-500 hover:bg-blue-50 dark:hover:bg-sky-500/5 cursor-default transition-all">
                  <Database className="w-4 h-4 text-sky-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-sm text-gray-900 dark:text-white font-medium">
                      Extended retention
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                      30, 60, or 90-day history add-ons
                    </p>
                  </div>
                </div>
                <div className="group flex items-start gap-3 p-3 rounded border border-gray-200 dark:border-gray-800/50 hover:border-blue-500 dark:hover:border-sky-500 hover:bg-blue-50 dark:hover:bg-sky-500/5 cursor-default transition-all">
                  <Bell className="w-4 h-4 text-sky-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-sm text-gray-900 dark:text-white font-medium">
                      Alert channels
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                      SMS, Slack, Discord, Telegram delivery
                    </p>
                  </div>
                </div>
                <div className="group flex items-start gap-3 p-3 rounded border border-gray-200 dark:border-gray-800/50 hover:border-blue-500 dark:hover:border-sky-500 hover:bg-blue-50 dark:hover:bg-sky-500/5 cursor-default transition-all">
                  <Zap className="w-4 h-4 text-sky-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-sm text-gray-900 dark:text-white font-medium">
                      Priority refresh
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                      Tighter polling intervals where APIs allow
                    </p>
                  </div>
                </div>
                <div className="group flex items-start gap-3 p-3 rounded border border-gray-200 dark:border-gray-800/50 hover:border-blue-500 dark:hover:border-sky-500 hover:bg-blue-50 dark:hover:bg-sky-500/5 cursor-default transition-all">
                  <Monitor className="w-4 h-4 text-sky-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-sm text-gray-900 dark:text-white font-medium">
                      Extra devices
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                      Additional device slots beyond the default 5
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── CTA ───────────────────────────────────────────────── */}
          <section className="text-center py-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to See It Live?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-8">
              SIGINT is currently in active development. Join the waitlist for
              early access or try the live demo now.
            </p>
            <div className="max-w-lg mx-auto mb-6">
              <WaitlistForm tier="pro" />
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://sigint-5154d935429b.herokuapp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg border border-green-500/40 dark:border-green-500/30 hover:border-green-500 dark:hover:border-green-400 bg-green-500/5 hover:bg-green-500/10 text-gray-700 dark:text-green-300 hover:text-gray-900 dark:hover:text-green-200 text-lg font-medium transition-all"
              >
                <Globe className="w-5 h-5" />
                Try Live Demo
              </a>
            </div>
          </section>
        </div>
      </PageContainer>
    </>
  );
}
