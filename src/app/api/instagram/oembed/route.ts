import { NextRequest, NextResponse } from "next/server";

/**
 * Instagram oEmbed APIプロキシ
 *
 * クライアントから直接 api.instagram.com を叩くとCORSエラーになるため、
 * Next.js API Route経由でプロキシする。
 *
 * 公開投稿であれば認証不要で利用可能。
 * レスポンスには埋め込み用のHTMLが含まれる。
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "url parameter required" }, { status: 400 });
  }

  try {
    const oembedUrl = `https://api.instagram.com/oembed?url=${encodeURIComponent(url)}&omitscript=true&maxwidth=600`;

    const res = await fetch(oembedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; YamatoSite/1.0)",
      },
      next: { revalidate: 3600 }, // 1時間キャッシュ
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Instagram API error: ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Instagram oEmbed proxy error:", error);
    return NextResponse.json(
      { error: "Failed to fetch oEmbed data" },
      { status: 500 }
    );
  }
}
