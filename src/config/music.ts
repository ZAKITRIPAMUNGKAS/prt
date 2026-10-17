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
    title: "Sway (Reff)",
    artist: "Colorcode • Wong Kalahan",
    src: "/music/colorcode-sway.mp3",
    cover: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&auto=format&fit=crop&q=80",
    lyrics: `[00:00.00] And I’m still screaming out your name
[00:06.60] Like you never really went away
[00:13.40] Every night wishing you would feel the same
[00:20.00] Every night I lie awake
[00:26.00] (Instrumental outro...)`,
  },
  {
    id: "2",
    title: "Kau Si Lagu Sedih (Reff)",
    artist: "Dongker • Wong Kalahan",
    src: "/music/dongker-kau-si-lagu-sedih.mp3",
    cover: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80",
    lyrics: `[00:00.00] Kau selalu terlihat indah
[00:04.20] Meski telah hilang
[00:07.10] Lihatlah, langit runtuh menunjukkan luka
[00:12.70] Dunia menyerang dan membabi buta
[00:18.50] Tapi aku terus hidup`,
  },
  {
    id: "3",
    title: "Rumit (Reff)",
    artist: "Rocket Rockers ft. Rizky Irmansyah",
    src: "/music/rocket-rockers-rumit.mp3",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80",
    lyrics: `[00:00.00] Lelah dengan harapan...
[00:05.50] Bila tak bisa bersama
[00:09.20] Jangan pernah beri harapan
[00:14.50] Terlalu rumit untuk dipikirkan
[00:20.50] Terlalu sakit untuk bertahan
[00:27.00] (Lelah dengan harapan...)`,
  },
  {
    id: "4",
    title: "December (Acoustic Reff)",
    artist: "Neck Deep • Wong Kalahan",
    src: "/music/neck-deep-december.mp3",
    cover: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80",
    lyrics: `[00:00.00] I hope you get your ballroom floor
[00:03.50] Your perfect house with rose red doors
[00:07.00] I'm the last thing you'd remember
[00:10.50] It's been a long, lonely December
[00:13.80] I wish I'd known that less is more
[00:17.00] But I was passed out on the floor
[00:20.20] And that's the last thing I remember
[00:23.80] It's been a long, lonely December`,
  },
];
