import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const REVIEWS_FILE = path.join(process.cwd(), "reviews.json");

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const review = {
      name: form.get("name") || "",
      review: form.get("review") || "",
      content: form.get("content") || "",
      rating: form.get("rating") || "",
      date: new Date().toISOString(),
      // File uploads (photo/video) are not saved in this demo
    };
    let reviews: any[] = [];
    try {
      const txt = await fs.readFile(REVIEWS_FILE, "utf8");
      reviews = JSON.parse(txt);
    } catch {}
    reviews.unshift(review);
    await fs.writeFile(REVIEWS_FILE, JSON.stringify(reviews, null, 2), "utf8");
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

export async function GET() {
  try {
    const txt = await fs.readFile(REVIEWS_FILE, "utf8");
    const reviews = JSON.parse(txt);
    return NextResponse.json(reviews);
  } catch {
    return NextResponse.json([]);
  }
}
