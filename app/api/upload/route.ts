import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { getUploadDirectory } from "../../../lib/content-store";

const allowedTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);
const maxImageBytes =
  Number(process.env.MAX_IMAGE_UPLOAD_MB || 12) * 1024 * 1024;
const maxVideoBytes =
  Number(process.env.MAX_VIDEO_UPLOAD_MB || 200) * 1024 * 1024;

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  if (!allowedTypes.has(file.type)) {
    return NextResponse.json(
      { error: "Only image and video files are supported" },
      { status: 400 },
    );
  }

  const isVideo = file.type.startsWith("video/");
  const maxBytes = isVideo ? maxVideoBytes : maxImageBytes;

  if (file.size > maxBytes) {
    return NextResponse.json(
      {
        error: `File is too large. ${isVideo ? "Video" : "Image"} uploads must be under ${Math.floor(maxBytes / 1024 / 1024)}MB.`,
      },
      { status: 413 },
    );
  }

  const extension = extensionFromType(file.type);
  const filename = `${Date.now()}-${randomUUID()}-${slugify(file.name)}.${extension}`;
  const uploadDir = getUploadDirectory();
  const outputPath = path.join(uploadDir, filename);

  await mkdir(uploadDir, { recursive: true });
  await writeFile(outputPath, Buffer.from(await file.arrayBuffer()));

  return NextResponse.json({
    url: `/uploads/${filename}`,
  });
}

function extensionFromType(type: string) {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  if (type === "image/gif") return "gif";
  if (type === "video/mp4") return "mp4";
  if (type === "video/webm") return "webm";
  if (type === "video/quicktime") return "mov";
  return "jpg";
}

function slugify(value: string) {
  return (
    value
      .replace(/\.[a-z0-9]+$/i, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "image"
  );
}
