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
    title: "Chill Coding Beats",
    artist: "Tepe Radio • Lo-fi Vibe",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: "2",
    title: "Midnight Ambient",
    artist: "Tepe Radio • Deep Focus",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: "3",
    title: "Flow & Horizon",
    artist: "Tepe Radio • Instrumental",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80",
  },
];
