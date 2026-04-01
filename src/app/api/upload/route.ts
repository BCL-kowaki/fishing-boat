import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import sharp from "sharp";

export async function POST(request: Request) {
  const authenticated = await verifySession();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const crop = formData.get("crop") as string | null; // "16:9" or null

  if (!file) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }

  // ファイルサイズ制限 (10MB — 変換後に軽くなるので余裕を持たせる)
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json(
      { error: "ファイルサイズは10MB以下にしてください" },
      { status: 400 }
    );
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "画像ファイルのみアップロード可能です" },
      { status: 400 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // sharp で処理
  let image = sharp(buffer);
  const metadata = await image.metadata();
  const origW = metadata.width || 1200;
  const origH = metadata.height || 800;

  // 16:9 トリミング（アイキャッチ用）
  if (crop === "16:9") {
    const targetRatio = 16 / 9;
    const currentRatio = origW / origH;

    if (currentRatio > targetRatio) {
      // 横長すぎ → 左右カット
      const newW = Math.round(origH * targetRatio);
      const left = Math.round((origW - newW) / 2);
      image = image.extract({
        left,
        top: 0,
        width: newW,
        height: origH,
      });
    } else {
      // 縦長すぎ → 上下カット（中央寄せ）
      const newH = Math.round(origW / targetRatio);
      const top = Math.round((origH - newH) / 2);
      image = image.extract({
        left: 0,
        top,
        width: origW,
        height: newH,
      });
    }

    // 最大幅1200pxにリサイズ
    image = image.resize({ width: 1200, withoutEnlargement: true });
  } else {
    // 通常アップ: 最大幅1200pxにリサイズのみ
    image = image.resize({ width: 1200, withoutEnlargement: true });
  }

  // WebP に変換（品質80）
  const webpBuffer = await image.webp({ quality: 80 }).toBuffer();

  // ファイル保存
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), webpBuffer);

  const url = `/uploads/${filename}`;
  return NextResponse.json({ url });
}
