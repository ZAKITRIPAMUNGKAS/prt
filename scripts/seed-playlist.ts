import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { db } from "../src/db";
import { playlistTracks } from "../src/db/schema";
import { defaultPlaylist } from "../src/config/music";

async function main() {
  console.log(`Seeding ${defaultPlaylist.length} tracks to playlist_tracks table...`);
  
  // Clear existing tracks
  await db.delete(playlistTracks);

  // Insert all 20 tracks
  for (let i = 0; i < defaultPlaylist.length; i++) {
    const t = defaultPlaylist[i];
    await db.insert(playlistTracks).values({
      title: t.title,
      artist: t.artist,
      src: t.src,
      cover: t.cover,
      lyrics: t.lyrics,
      order: i + 1,
      isActive: true,
    });
  }

  console.log(`Successfully seeded ${defaultPlaylist.length} tracks into playlist_tracks!`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Error seeding playlist:", err);
  process.exit(1);
});
