export interface Track {
  id: string;
  title: string;
  artist: string;
  src: string;
  cover: string;
}

export const defaultPlaylist: Track[] = [
  {
    id: "1",
    title: "Sway (Chorus Edit)",
    artist: "Michael Bublé • #wongkalahan",
    src: "/music/sway.mp3",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "2",
    title: "Kisinan 2 (Wong Kalahan)",
    artist: "Masdddho • Reff Viral",
    src: "/music/kisinan-2.mp3",
    cover: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "3",
    title: "End of Beginning (Chicago Reff)",
    artist: "Djo • Viral Nostalgia",
    src: "/music/end-of-beginning.mp3",
    cover: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "4",
    title: "I Wanna Be Yours (Climax Reff)",
    artist: "Arctic Monkeys • Cinematic Edit",
    src: "/music/i-wanna-be-yours.mp3",
    cover: "https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "5",
    title: "Apocalypse (Chorus Edit)",
    artist: "Cigarettes After Sex • Moody Vibe",
    src: "/music/apocalypse.mp3",
    cover: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80",
  },
];
