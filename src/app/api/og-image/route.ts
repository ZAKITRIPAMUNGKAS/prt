import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/modules/s3/lib/server-client";

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

    // Read full body into buffer so we can set Content-Length
    // Required by WhatsApp/Facebook/Twitter crawlers to display preview images
    const bytes = await object.Body.transformToByteArray();
    const buffer = Buffer.from(bytes);

    return new Response(buffer, {
      headers: {
        "Cache-Control": CACHE_CONTROL,
        "Content-Disposition": "inline",
        "Content-Type": object.ContentType || "image/jpeg",
        "Content-Length": String(buffer.length),
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
