import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/modules/s3/lib/server-client";

export const runtime = "nodejs";

const CACHE_CONTROL =
  "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400";

function isValidProjectImageKey(key: string) {
  return (
    key.startsWith("projects/") &&
    key.length <= 1024 &&
    !key.includes("..") &&
    !key.includes("\\")
  );
}

export async function GET(request: Request) {
  const key = new URL(request.url).searchParams.get("key");

  if (!key || !isValidProjectImageKey(key)) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const object = await s3Client.send(
      new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
      })
    );

    const contentType = object.ContentType;
    if (!object.Body || !contentType?.startsWith("image/")) {
      return new Response("Not found", { status: 404 });
    }

    const headers = new Headers({
      "Cache-Control": CACHE_CONTROL,
      "Content-Disposition": "inline",
      "Content-Type": contentType,
      "X-Content-Type-Options": "nosniff",
    });

    if (object.ContentLength !== undefined) {
      headers.set("Content-Length", String(object.ContentLength));
    }

    return new Response(object.Body.transformToWebStream(), { headers });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
