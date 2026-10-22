"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const AudioPlayer = dynamic(
  () => import("@/components/audio-player").then((module) => module.AudioPlayer),
  { ssr: false },
);

export function GlobalAudioPlayer() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const load = () => setShouldLoad(true);
    const timeout = window.setTimeout(load, 3_000);

    window.addEventListener("pointerdown", load, { once: true });
    window.addEventListener("keydown", load, { once: true });

    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("pointerdown", load);
      window.removeEventListener("keydown", load);
    };
  }, []);

  return shouldLoad ? <AudioPlayer /> : null;
}
