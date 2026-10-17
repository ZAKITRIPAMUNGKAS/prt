export interface LyricLine {
  time: number; // in seconds
  text: string;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  src: string;
  cover: string;
  lyrics?: string | null;
}

export function parseLrc(lrcText?: string | null): LyricLine[] {
  if (!lrcText) return [];
  const lines = lrcText.split("\n");
  const result: LyricLine[] = [];
  const timeRegex = /\[(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\]/;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;
    const match = line.match(timeRegex);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const milliseconds = match[3] ? parseInt(match[3].padEnd(3, "0").slice(0, 3), 10) : 0;
      const totalSeconds = minutes * 60 + seconds + milliseconds / 1000;
      const text = line.replace(timeRegex, "").trim();
      if (text) {
        result.push({ time: totalSeconds, text });
      }
    } else if (line.length > 0) {
      result.push({ time: result.length * 4, text: line });
    }
  }

  return result.sort((a, b) => a.time - b.time);
}

export const defaultPlaylist: Track[] = [
  {
    id: "1",
    title: "Sway (Chorus Edit)",
    artist: "Michael Bublé • #wongkalahan",
    src: "/music/sway.mp3",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80",
    lyrics: `[00:00.00] (Instrumental rhythms...)
[00:04.20] When marimba rhythms start to play
[00:09.10] Dance with me, make me sway
[00:13.80] Like a lazy ocean hugs the shore
[00:19.00] Hold me close, sway me more
[00:24.40] Like a flower bending in the breeze
[00:29.50] Bend with me, sway with ease
[00:34.20] When we dance, you have a way with me
[00:39.00] Stay with me, sway with me`,
  },
];
