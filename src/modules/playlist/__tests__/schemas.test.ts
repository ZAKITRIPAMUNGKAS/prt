import { describe, expect, it } from "vitest";
import { playlistTrackFormSchema } from "../server/procedures";
import { defaultPlaylist } from "@/config/music";

describe("playlistTrackFormSchema validation", () => {
  it("validates a complete track object successfully", () => {
    const result = playlistTrackFormSchema.safeParse({
      title: "Midnight Chill Beats",
      artist: "Tepe Radio",
      src: "https://example.com/audio.mp3",
      cover: "https://example.com/cover.jpg",
      order: 1,
      isActive: true,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe("Midnight Chill Beats");
      expect(result.data.artist).toBe("Tepe Radio");
      expect(result.data.src).toBe("https://example.com/audio.mp3");
      expect(result.data.cover).toBe("https://example.com/cover.jpg");
      expect(result.data.order).toBe(1);
      expect(result.data.isActive).toBe(true);
    }
  });

  it("applies default values for optional fields", () => {
    const result = playlistTrackFormSchema.safeParse({
      title: "Lofi Study",
      src: "https://example.com/audio.mp3",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.artist).toBe("");
      expect(result.data.order).toBe(0);
      expect(result.data.isActive).toBe(true);
      expect(result.data.cover).toBeUndefined();
    }
  });

  it("fails when title is empty or missing", () => {
    const result = playlistTrackFormSchema.safeParse({
      title: "",
      src: "https://example.com/audio.mp3",
    });
    expect(result.success).toBe(false);
  });

  it("fails when src is empty or missing", () => {
    const result = playlistTrackFormSchema.safeParse({
      title: "Track without source",
      src: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("defaultPlaylist configuration", () => {
  it("contains at least one starter track", () => {
    expect(defaultPlaylist.length).toBeGreaterThan(0);
  });

  it("ensures all starter tracks have required non-empty fields", () => {
    defaultPlaylist.forEach((track) => {
      expect(track.id).toBeTruthy();
      expect(track.title).toBeTruthy();
      expect(track.artist).toBeTruthy();
      expect(track.src).toMatch(/^https?:\/\//);
      expect(track.cover).toBeTruthy();
    });
  });
});
