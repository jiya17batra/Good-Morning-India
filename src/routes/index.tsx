import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import courtyard from "@/assets/courtyard.png.asset.json";

const SPOTIFY_TRACK = "1C2MHvFmeoFpExBtWOiQ4Z";
const SPOTIFY_URL = `https://open.spotify.com/track/${SPOTIFY_TRACK}`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Toli Velugu — First Light of the Courtyard" },
      {
        name: "description",
        content:
          "A living South Indian courtyard that changes with the hour. Touch the Tulsi to let Suprabhatam fill the morning.",
      },
      { property: "og:title", content: "Toli Velugu — First Light of the Courtyard" },
      {
        property: "og:description",
        content:
          "A living South Indian courtyard that changes with the hour. Touch the Tulsi to let Suprabhatam fill the morning.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Phase = "morning" | "afternoon" | "evening" | "night";

function phaseFor(h: number): Phase {
  if (h >= 5 && h < 11) return "morning";
  if (h >= 11 && h < 17) return "afternoon";
  if (h >= 17 && h < 20) return "evening";
  return "night";
}

const GREETING: Record<Phase, string> = {
  morning: "Toli Velugu — the first light",
  afternoon: "Madhyahnam — the bright hour",
  evening: "Sandhya — the sky turns to saffron",
  night: "Ratri — the courtyard rests",
};

function Index() {
  const [now, setNow] = useState<Date | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const phase: Phase = now ? phaseFor(now.getHours()) : "morning";
  const clock = now
    ? now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";

  const birds = useMemo(
    () => [
      { top: "12%", delay: "0s", dur: "34s", scale: 1 },
      { top: "18%", delay: "6s", dur: "42s", scale: 0.7 },
      { top: "8%", delay: "14s", dur: "38s", scale: 0.85 },
    ],
    [],
  );

  return (
    <main className={`courtyard phase-${phase}`}>
      <img src={courtyard.url} alt="" aria-hidden="true" className="courtyard-bg" />
      <div className="courtyard-tint" aria-hidden="true" />
      <div className="courtyard-breeze" aria-hidden="true" />

      <div className="sky-layer" aria-hidden="true">
        <span className="cloud cloud-1" />
        <span className="cloud cloud-2" />
        <span className="cloud cloud-3" />
        {phase === "night" ? (
          <span className="moon" />
        ) : (
          birds.map((b, i) => (
            <span
              key={i}
              className="bird"
              style={{
                top: b.top,
                animationDelay: b.delay,
                animationDuration: b.dur,
                ["--bird-scale" as string]: b.scale,
              }}
            />
          ))
        )}
      </div>

      <header className="courtyard-head">
        <h1 className="courtyard-title">Toli Velugu</h1>
        <p className="courtyard-sub">{GREETING[phase]}</p>
        <p className="courtyard-clock">{clock}</p>
      </header>

      <button
        type="button"
        className={`tulsi-hotspot${playing ? " is-playing" : ""}`}
        aria-label="Play Sri Venkateshwara Suprabhatham"
        aria-pressed={playing}
        onClick={() => setPlaying(true)}
      >
        <span className="tulsi-glow" aria-hidden="true" />
        <span className="tulsi-ripple" aria-hidden="true" />
        <span className="tulsi-ripple tulsi-ripple-2" aria-hidden="true" />
        <span className="tulsi-hint">
          {playing ? "Suprabhatam is playing" : "Listen to Suprabhatam"}
        </span>
      </button>

      {playing && (
        <div className="suprabhatam-player">
          <iframe
            title="Sri Venkateshwara Suprabhatham — M. S. Subbulakshmi"
            src={`https://open.spotify.com/embed/track/${SPOTIFY_TRACK}?utm_source=generator&autoplay=1`}
            width="100%"
            height="80"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
          <a
            className="suprabhatam-fallback"
            href={SPOTIFY_URL}
            target="_blank"
            rel="noreferrer"
          >
            Open in Spotify
          </a>
        </div>
      )}
    </main>
  );
}
