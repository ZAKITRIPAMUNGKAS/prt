import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/modules/s3/lib/server-client";
import sharp from "sharp";

export const runtime = "nodejs";

const CACHE_CONTROL =
  "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400";

function isValidPostKey(key: string) {
  return (
    key.startsWith("posts/") &&
    key.length <= 1024 &&
    !key.includes("..") &&
    !key.includes("\\")
  );
}

export async function GET(request: Request) {
  const key = new URL(request.url).searchParams.get("key");

  if (!key || !isValidPostKey(key)) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const object = await s3Client.send(
      new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
      })
    );

    if (!object.Body) {
      return new Response("Not found", { status: 404 });
    }

    // Read full body into buffer
    const bytes = await object.Body.transformToByteArray();
    const rawBuffer = Buffer.from(bytes);

    // Optimize image for WhatsApp and social crawlers:
    // WhatsApp hard requirements:
    // 1. Max file size < 300 KB (WhatsApp scraper ignores images > 300KB)
    // 2. Aspect ratio ~1.91:1 (ideal 1200x630)
    // 3. Format JPEG / PNG
    const optimizedBuffer = await sharp(rawBuffer)
      .resize({
        width: 1200,
        height: 630,
        fit: "cover",
        position: "center",
      })
      .jpeg({
        quality: 80,
        progressive: true,
        mozjpeg: true,
      })
      .toBuffer();

    return new Response(new Uint8Array(optimizedBuffer), {
      headers: {
        "Cache-Control": CACHE_CONTROL,
        "Content-Disposition": "inline",
        "Content-Type": "image/jpeg",
        "Content-Length": String(optimizedBuffer.length),
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
