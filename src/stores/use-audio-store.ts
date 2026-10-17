import { create } from "zustand";
import { defaultPlaylist, type Track } from "@/config/music";

export interface AudioControls {
  play: () => void;
  pause: () => void;
  toggle: () => void;
  seek: (percent: number) => void;
  jumpTo: (time: number) => void;
}

interface AudioStoreState {
  tracks: Track[];
  currentIndex: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  progress: number;
  showLyrics: boolean;
  controls: AudioControls | null;

  // Actions
  setTracks: (tracks: Track[]) => void;
  setCurrentIndex: (index: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setProgress: (progress: number) => void;
  setShowLyrics: (show: boolean | ((prev: boolean) => boolean)) => void;
  setControls: (controls: AudioControls | null) => void;
}

export const useAudioStore = create<AudioStoreState>((set) => ({
  tracks: defaultPlaylist,
  currentIndex: 0,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  progress: 0,
  showLyrics: true,
  controls: null,

  setTracks: (tracks) => set({ tracks }),
  setCurrentIndex: (currentIndex) => set({ currentIndex }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setDuration: (duration) => set({ duration }),
  setProgress: (progress) => set({ progress }),
  setShowLyrics: (show) =>
    set((state) => ({
      showLyrics: typeof show === "function" ? show(state.showLyrics) : show,
    })),
  setControls: (controls) => set({ controls }),
}));

// Helper selector to get current track & parsed lyrics
export const useCurrentTrack = () => {
  const tracks = useAudioStore((s) => s.tracks);
  const currentIndex = useAudioStore((s) => s.currentIndex);
  const safeIndex = currentIndex < tracks.length ? currentIndex : 0;
  return tracks[safeIndex] || tracks[0] || null;
};
