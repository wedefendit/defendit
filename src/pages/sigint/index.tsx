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
  badgeColor = "border border-sky-300/80 bg-sky-100/90 text-sky-700 dark:border-sky-400/20 dark:bg-sky-500/15 dark:text-sky-300",
}: SourceCardProps) {
  return (
    <div className="group relative flex items-start gap-4 overflow-hidden rounded-xl border border-slate-200/80 bg-white/72 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.05),transparent_58%)] p-4 shadow-[0_12px_30px_rgba(15,23,42,0.08)] ring-1 ring-white/70 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-300/80 hover:bg-white/84 hover:shadow-[0_18px_38px_rgba(15,23,42,0.12)] dark:border-slate-700/70 dark:bg-slate-900/58 dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.09),transparent_60%)] dark:shadow-[0_18px_36px_rgba(2,6,23,0.3)] dark:ring-white/5 dark:hover:border-sky-400/30 dark:hover:bg-slate-900/74 dark:hover:shadow-[0_24px_46px_rgba(2,6,23,0.36)]">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-sky-200/80 bg-sky-100/90 text-blue-700 shadow-[0_8px_18px_rgba(59,130,246,0.12)] transition-all group-hover:scale-110 group-hover:text-blue-800 dark:border-sky-400/14 dark:bg-slate-800/88 dark:text-sky-400 dark:shadow-[0_10px_22px_rgba(2,132,199,0.14)] dark:group-hover:text-sky-300">
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
    <div className="group relative overflow-hidden rounded-xl border border-slate-200/80 bg-white/72 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.05),transparent_58%)] p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)] ring-1 ring-white/70 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-300/80 hover:bg-white/84 hover:shadow-[0_18px_38px_rgba(15,23,42,0.12)] dark:border-slate-700/70 dark:bg-slate-900/58 dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.09),transparent_60%)] dark:shadow-[0_18px_36px_rgba(2,6,23,0.3)] dark:ring-white/5 dark:hover:border-sky-400/30 dark:hover:bg-slate-900/74 dark:hover:shadow-[0_24px_46px_rgba(2,6,23,0.36)]">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-sky-200/80 bg-sky-100/90 text-blue-700 shadow-[0_8px_18px_rgba(59,130,246,0.12)] transition-all group-hover:scale-110 group-hover:text-blue-800 dark:border-sky-400/14 dark:bg-slate-800/88 dark:text-sky-400 dark:shadow-[0_10px_22px_rgba(2,132,199,0.14)] dark:group-hover:text-sky-300">
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
              <span>OSINT dashboard project by Defend I.T. Solutions</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.05] text-gray-900 dark:text-white mb-3">
              <span className="text-blue-600 dark:text-sky-400">
                SIGINT Dashboard&trade;
              </span>
            </h1>

            <p className="text-xl sm:text-2xl md:text-4xl font-medium text-gray-700 dark:text-gray-300 mb-6">
              Real-Time Intelligence, Correlated
            </p>

            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
              Live aircraft, vessels, weather alerts, earthquakes, fires,
              conflict events, and news in one interface. Self-host the
              community build today, or follow the roadmap for hosted
              Individual, Team, and Enterprise tiers.
            </p>

            <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap sm:gap-5">
              <a
                href="https://sigint-5154d935429b.herokuapp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-emerald-400/85 bg-emerald-100/92 px-8 py-4 text-lg font-medium text-emerald-900 shadow-[0_12px_28px_rgba(16,185,129,0.16)] backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-emerald-500/90 hover:bg-emerald-100 hover:text-emerald-950 hover:shadow-[0_16px_34px_rgba(16,185,129,0.2)] dark:border-green-500/30 dark:bg-emerald-950/40 dark:text-green-300 dark:shadow-[0_14px_28px_rgba(16,185,129,0.14)] dark:hover:border-green-400 dark:hover:bg-emerald-950/55 dark:hover:text-green-200 dark:hover:shadow-[0_18px_34px_rgba(16,185,129,0.2)]"
              >
                <Globe className="w-5 h-5" />
                Live Demo
              </a>
              <a
                href="#pricing"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white/80 px-8 py-4 text-lg font-medium text-slate-800 shadow-[0_8px_18px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-300/80 hover:bg-white hover:text-sky-800 hover:shadow-[0_14px_28px_rgba(15,23,42,0.12)] dark:border-slate-600 dark:bg-slate-950/78 dark:text-slate-200 dark:shadow-[0_14px_28px_rgba(2,6,23,0.22)] dark:hover:border-sky-400/28 dark:hover:bg-slate-900 dark:hover:text-sky-200"
              >
                View Pricing
              </a>
              <a
                href="https://github.com/wedefendit/sigint"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white/80 px-8 py-4 text-lg font-medium text-slate-800 shadow-[0_8px_18px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-300/80 hover:bg-white hover:text-sky-800 hover:shadow-[0_14px_28px_rgba(15,23,42,0.12)] dark:border-slate-600 dark:bg-slate-950/78 dark:text-slate-200 dark:shadow-[0_14px_28px_rgba(2,6,23,0.22)] dark:hover:border-sky-400/28 dark:hover:bg-slate-900 dark:hover:text-sky-200"
              >
                <Github className="w-5 h-5" />
                View on GitHub
              </a>
            </div>

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
                automatically. Open the dashboard and see aircraft, vessels,
                crisis events, weather alerts, fires, quakes, and news in one
                place instead of chasing half a dozen tabs.
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
                SIGINT is built to reduce context switching and surface what
                matters faster. The point is not just to show a map. It is to
                help one person or a small team move from raw feeds to usable
                awareness.
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
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-red-300/80 bg-red-100/90 px-2.5 py-1 text-xs font-bold text-red-700 dark:border-red-500/20 dark:bg-red-500/15 dark:text-red-300">
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
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-violet-300/80 bg-violet-100/90 px-2.5 py-1 text-xs font-bold text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/15 dark:text-violet-300">
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
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-300/80 bg-sky-100/90 px-2.5 py-1 text-xs font-bold text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/15 dark:text-sky-300">
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
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/80 bg-amber-100/90 px-2.5 py-1 text-xs font-bold text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/15 dark:text-amber-300">
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
          <section className="rounded-2xl border border-slate-200/80 bg-white/72 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.05),transparent_60%)] px-6 py-10 shadow-[0_16px_34px_rgba(15,23,42,0.08)] ring-1 ring-white/70 backdrop-blur-md dark:border-slate-700/70 dark:bg-slate-900/58 dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.08),transparent_62%)] dark:shadow-[0_20px_40px_rgba(2,6,23,0.32)] dark:ring-white/5">
            <div className="text-center mb-8">
              <SectionTag>Architecture</SectionTag>
              <SectionTitle>Built as a Real Product, Not a Mockup</SectionTitle>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  60K+
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Tracks rendered smoothly in live sessions, with the UI staying
                  responsive under load.
                </p>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  Single Deploy
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Community stays simple to self-host. Hosted tiers add the
                  backend features that do not belong in a browser-only setup.
                </p>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  Offline Ready
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Installable as a PWA, with fast reloads and cached state for
                  repeat use.
                </p>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  Open Stack
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Community is self-hostable. Hosted tiers build on that
                  foundation with persistence, alerts, sync, and paid
                  infrastructure.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200/80 bg-white/72 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.05),transparent_60%)] px-6 py-10 shadow-[0_16px_34px_rgba(15,23,42,0.08)] ring-1 ring-white/70 backdrop-blur-md dark:border-slate-700/70 dark:bg-slate-900/58 dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.08),transparent_62%)] dark:shadow-[0_20px_40px_rgba(2,6,23,0.32)] dark:ring-white/5">
            <div className="text-center">
              <SectionTag>Product Direction</SectionTag>
              <SectionTitle>
                Community Today. Hosted Platform Roadmap.
              </SectionTitle>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                SIGINT Dashboard is already a real working project, not a
                landing-page concept. The community build proves the core
                platform today. The hosted tiers are where persistent backend
                features, alerting, sync, team workflows, and commercial support
                come in.
              </p>
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
                Community is available now for self-hosting. Paid tiers are the
                product roadmap for users who want hosted infrastructure, longer
                retention, alerts, sync, collaboration, and features that do not
                make sense to bolt onto a browser-only build.
              </p>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
              {/* Community */}
              <div className="flex h-full flex-col rounded-xl border border-slate-200/80 bg-white/72 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.05),transparent_62%)] p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)] ring-1 ring-white/70 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-300/80 hover:bg-white/84 hover:shadow-[0_18px_38px_rgba(15,23,42,0.12)] dark:border-slate-700/70 dark:bg-slate-900/58 dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.09),transparent_60%)] dark:shadow-[0_18px_36px_rgba(2,6,23,0.3)] dark:ring-white/5 dark:hover:border-green-500/30 dark:hover:bg-slate-900/74 dark:hover:shadow-[0_24px_46px_rgba(2,6,23,0.36)]">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Github className="w-5 h-5 text-gray-700 dark:text-gray-400" />
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
                    Self-hosted. Your server, your API keys, your environment.
                  </p>
                </div>
                <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300 flex-1">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-700 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span>All live data sources</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-700 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Correlation engine &amp; anomaly detection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-700 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span>All 8 pane types including video &amp; news</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-700 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Watch mode, entity dossier, alert scoring</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-700 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span>7-day rolling data window (browser-local)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-700 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Dark and light themes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-700 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span>JSON export</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-700 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Web app (PWA installable)</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <a
                    href="https://github.com/wedefendit/sigint"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-sky-500 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-all"
                  >
                    View on GitHub
                  </a>
                </div>
              </div>

              {/* Individual */}
              <div className="relative flex h-full flex-col rounded-xl border border-sky-300/80 bg-white/76 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.1),transparent_62%)] p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)] ring-1 ring-sky-200/70 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-400/90 hover:bg-white/86 hover:shadow-[0_18px_38px_rgba(15,23,42,0.12)] dark:border-sky-400/25 dark:bg-slate-900/62 dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12),transparent_62%)] dark:shadow-[0_18px_36px_rgba(2,6,23,0.32)] dark:ring-sky-400/10 dark:hover:border-sky-400/38 dark:hover:bg-slate-900/76 dark:hover:shadow-[0_24px_46px_rgba(2,6,23,0.38)]">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-sky-600 px-3 py-0.5 text-xs font-bold text-white shadow-[0_10px_22px_rgba(2,132,199,0.18)] dark:bg-sky-500">
                  COMING SOON
                </div>
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-5 h-5 text-sky-700 dark:text-sky-400" />
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
                    Built for solo users who want hosted infrastructure,
                    persistent history, alerts, and cross-device access without
                    running the backend themselves.
                  </p>
                </div>
                <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300 flex-1">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-sky-700 dark:text-sky-400 mt-0.5 flex-shrink-0" />
                    <span>Everything in Community</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Monitor className="w-4 h-4 text-sky-700 dark:text-sky-400 mt-0.5 flex-shrink-0" />
                    <span>
                      Desktop app with native notifications &amp; tray
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Database className="w-4 h-4 text-sky-700 dark:text-sky-400 mt-0.5 flex-shrink-0" />
                    <span>90-day event history &amp; historical replay</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-sky-700 dark:text-sky-400 mt-0.5 flex-shrink-0" />
                    <span>Geofenced alerts with push &amp; email</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Bell className="w-4 h-4 text-sky-700 dark:text-sky-400 mt-0.5 flex-shrink-0" />
                    <span>Custom alert rules across all sources</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Radar className="w-4 h-4 text-sky-700 dark:text-sky-400 mt-0.5 flex-shrink-0" />
                    <span>90-day rolling anomaly baselines</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-sky-700 dark:text-sky-400 mt-0.5 flex-shrink-0" />
                    <span>Synced state across devices</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-sky-700 dark:text-sky-400 mt-0.5 flex-shrink-0" />
                    <span>CSV &amp; KML export</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <WaitlistForm tier="individual" stacked />
                </div>
              </div>

              {/* Team */}
              <div className="relative flex h-full flex-col rounded-xl border border-violet-300/80 bg-white/76 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.1),transparent_62%)] p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)] ring-1 ring-violet-200/65 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-400/90 hover:bg-white/86 hover:shadow-[0_18px_38px_rgba(15,23,42,0.12)] dark:border-violet-400/25 dark:bg-slate-900/62 dark:bg-[radial-gradient(circle_at_top,rgba(167,139,250,0.12),transparent_62%)] dark:shadow-[0_18px_36px_rgba(2,6,23,0.32)] dark:ring-violet-400/10 dark:hover:border-violet-400/38 dark:hover:bg-slate-900/76 dark:hover:shadow-[0_24px_46px_rgba(2,6,23,0.38)]">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-violet-600 px-3 py-0.5 text-xs font-bold text-white shadow-[0_10px_22px_rgba(124,58,237,0.18)] dark:bg-violet-500">
                  COMING SOON
                </div>
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-violet-700 dark:text-violet-400" />
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
                    Built for small teams that need shared workspaces, shared
                    alerts, role-based access, and collaboration on top of the
                    hosted platform.
                  </p>
                </div>
                <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300 flex-1">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-violet-700 dark:text-violet-400 mt-0.5 flex-shrink-0" />
                    <span>Everything in Individual</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Layers className="w-4 h-4 text-violet-700 dark:text-violet-400 mt-0.5 flex-shrink-0" />
                    <span>Shared workspaces &amp; layout presets</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-violet-700 dark:text-violet-400 mt-0.5 flex-shrink-0" />
                    <span>Shared geofences &amp; alert rules</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Radio className="w-4 h-4 text-violet-700 dark:text-violet-400 mt-0.5 flex-shrink-0" />
                    <span>Team annotations on events</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-violet-700 dark:text-violet-400 mt-0.5 flex-shrink-0" />
                    <span>Role-based access (admin / analyst / viewer)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Users className="w-4 h-4 text-violet-700 dark:text-violet-400 mt-0.5 flex-shrink-0" />
                    <span>Invite &amp; manage team members</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <WaitlistForm tier="team" stacked />
                </div>
              </div>

              {/* Enterprise */}
              <div className="relative flex h-full flex-col rounded-xl border border-amber-300/80 bg-white/76 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.1),transparent_62%)] p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)] ring-1 ring-amber-200/65 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-400/90 hover:bg-white/86 hover:shadow-[0_18px_38px_rgba(15,23,42,0.12)] dark:border-amber-400/22 dark:bg-slate-900/62 dark:bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.11),transparent_62%)] dark:shadow-[0_18px_36px_rgba(2,6,23,0.32)] dark:ring-amber-400/8 dark:hover:border-amber-400/34 dark:hover:bg-slate-900/76 dark:hover:shadow-[0_24px_46px_rgba(2,6,23,0.38)]">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-amber-700 dark:text-amber-400" />
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
                    For organizations that need dedicated deployment, deeper
                    integrations, stronger controls, and a more formal support
                    model.
                  </p>
                </div>
                <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300 flex-1">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-700 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                    <span>Everything in Team</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Brain className="w-4 h-4 text-amber-700 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                    <span>AI threat briefs, NL queries, daily digests</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Radio className="w-4 h-4 text-amber-700 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                    <span>Custom data source integration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lock className="w-4 h-4 text-amber-700 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                    <span>SSO &amp; on-prem deployment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Zap className="w-4 h-4 text-amber-700 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                    <span>Full API access</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Database className="w-4 h-4 text-amber-700 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                    <span>Unlimited data retention</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Eye className="w-4 h-4 text-amber-700 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                    <span>Audit log with non-repudiation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-amber-700 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                    <span>SLA, dedicated support, compliance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Globe className="w-4 h-4 text-amber-700 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                    <span>White-label &amp; custom branding</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <WaitlistForm tier="enterprise" stacked />
                </div>
              </div>
            </div>

            {/* Add-ons callout */}
            <div className="mt-10 rounded-2xl border border-slate-200/80 bg-white/72 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.05),transparent_62%)] p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)] ring-1 ring-white/70 backdrop-blur-md dark:border-slate-700/70 dark:bg-slate-900/58 dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.09),transparent_62%)] dark:shadow-[0_18px_36px_rgba(2,6,23,0.3)] dark:ring-white/5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-5">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Add-ons
                </h3>
                <span className="rounded-full border border-sky-300/80 bg-sky-100/90 px-2.5 py-0.5 text-xs font-bold text-sky-700 dark:border-sky-400/20 dark:bg-sky-500/20 dark:text-sky-300">
                  AVAILABLE ON INDIVIDUAL &amp; TEAM
                </span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="group flex items-start gap-3 rounded-lg border border-slate-200/80 bg-white/72 p-3 shadow-[0_10px_22px_rgba(15,23,42,0.06)] ring-1 ring-white/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-300/80 hover:bg-white/84 hover:shadow-[0_16px_30px_rgba(15,23,42,0.1)] dark:border-slate-700/65 dark:bg-slate-900/46 dark:ring-white/5 dark:hover:border-sky-400/28 dark:hover:bg-slate-900/62 dark:hover:shadow-[0_18px_34px_rgba(2,6,23,0.28)]">
                  <Newspaper className="mt-0.5 h-4 w-4 flex-shrink-0 text-sky-700 dark:text-sky-400" />
                  <div>
                    <span className="text-sm text-gray-900 dark:text-white font-medium">
                      Custom RSS feeds
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                      Add your own sources, fetched through our server
                    </p>
                  </div>
                </div>
                <div className="group flex items-start gap-3 rounded-lg border border-slate-200/80 bg-white/72 p-3 shadow-[0_10px_22px_rgba(15,23,42,0.06)] ring-1 ring-white/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-300/80 hover:bg-white/84 hover:shadow-[0_16px_30px_rgba(15,23,42,0.1)] dark:border-slate-700/65 dark:bg-slate-900/46 dark:ring-white/5 dark:hover:border-sky-400/28 dark:hover:bg-slate-900/62 dark:hover:shadow-[0_18px_34px_rgba(2,6,23,0.28)]">
                  <Satellite className="mt-0.5 h-4 w-4 flex-shrink-0 text-sky-700 dark:text-sky-400" />
                  <div>
                    <span className="text-sm text-gray-900 dark:text-white font-medium">
                      Premium data sources
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                      ADS-B Exchange, ACLED, and other paid feeds
                    </p>
                  </div>
                </div>
                <div className="group flex items-start gap-3 rounded-lg border border-slate-200/80 bg-white/72 p-3 shadow-[0_10px_22px_rgba(15,23,42,0.06)] ring-1 ring-white/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-300/80 hover:bg-white/84 hover:shadow-[0_16px_30px_rgba(15,23,42,0.1)] dark:border-slate-700/65 dark:bg-slate-900/46 dark:ring-white/5 dark:hover:border-sky-400/28 dark:hover:bg-slate-900/62 dark:hover:shadow-[0_18px_34px_rgba(2,6,23,0.28)]">
                  <Database className="mt-0.5 h-4 w-4 flex-shrink-0 text-sky-700 dark:text-sky-400" />
                  <div>
                    <span className="text-sm text-gray-900 dark:text-white font-medium">
                      Extended retention
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                      30, 60, or 90-day history add-ons
                    </p>
                  </div>
                </div>
                <div className="group flex items-start gap-3 rounded-lg border border-slate-200/80 bg-white/72 p-3 shadow-[0_10px_22px_rgba(15,23,42,0.06)] ring-1 ring-white/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-300/80 hover:bg-white/84 hover:shadow-[0_16px_30px_rgba(15,23,42,0.1)] dark:border-slate-700/65 dark:bg-slate-900/46 dark:ring-white/5 dark:hover:border-sky-400/28 dark:hover:bg-slate-900/62 dark:hover:shadow-[0_18px_34px_rgba(2,6,23,0.28)]">
                  <Bell className="mt-0.5 h-4 w-4 flex-shrink-0 text-sky-700 dark:text-sky-400" />
                  <div>
                    <span className="text-sm text-gray-900 dark:text-white font-medium">
                      Alert channels
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                      SMS, Slack, Discord, Telegram delivery
                    </p>
                  </div>
                </div>
                <div className="group flex items-start gap-3 rounded-lg border border-slate-200/80 bg-white/72 p-3 shadow-[0_10px_22px_rgba(15,23,42,0.06)] ring-1 ring-white/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-300/80 hover:bg-white/84 hover:shadow-[0_16px_30px_rgba(15,23,42,0.1)] dark:border-slate-700/65 dark:bg-slate-900/46 dark:ring-white/5 dark:hover:border-sky-400/28 dark:hover:bg-slate-900/62 dark:hover:shadow-[0_18px_34px_rgba(2,6,23,0.28)]">
                  <Zap className="mt-0.5 h-4 w-4 flex-shrink-0 text-sky-700 dark:text-sky-400" />
                  <div>
                    <span className="text-sm text-gray-900 dark:text-white font-medium">
                      Priority refresh
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                      Tighter polling intervals where APIs allow
                    </p>
                  </div>
                </div>
                <div className="group flex items-start gap-3 rounded-lg border border-slate-200/80 bg-white/72 p-3 shadow-[0_10px_22px_rgba(15,23,42,0.06)] ring-1 ring-white/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-300/80 hover:bg-white/84 hover:shadow-[0_16px_30px_rgba(15,23,42,0.1)] dark:border-slate-700/65 dark:bg-slate-900/46 dark:ring-white/5 dark:hover:border-sky-400/28 dark:hover:bg-slate-900/62 dark:hover:shadow-[0_18px_34px_rgba(2,6,23,0.28)]">
                  <Monitor className="mt-0.5 h-4 w-4 flex-shrink-0 text-sky-700 dark:text-sky-400" />
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
              <WaitlistForm tier="individual" />
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://sigint-5154d935429b.herokuapp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-emerald-400/85 bg-emerald-100/92 px-8 py-4 text-lg font-medium text-emerald-900 shadow-[0_12px_28px_rgba(16,185,129,0.16)] backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-emerald-500/90 hover:bg-emerald-100 hover:text-emerald-950 hover:shadow-[0_16px_34px_rgba(16,185,129,0.2)] dark:border-green-500/30 dark:bg-emerald-950/40 dark:text-green-300 dark:shadow-[0_14px_28px_rgba(16,185,129,0.14)] dark:hover:border-green-400 dark:hover:bg-emerald-950/55 dark:hover:text-green-200 dark:hover:shadow-[0_18px_34px_rgba(16,185,129,0.2)]"
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
