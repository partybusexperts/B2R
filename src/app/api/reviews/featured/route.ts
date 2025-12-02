import { NextResponse } from "next/server";
import { getFeaturedReviews, getAggregateRating } from "@/lib/server/reviews";

export async function GET() {
  try {
    const [reviews, agg] = await Promise.all([
      getFeaturedReviews(24),
      getAggregateRating(),
    ]);

    return NextResponse.json({ reviews, agg });
  } catch (err) {
    console.error("Error loading featured reviews", err);
    return NextResponse.json({ reviews: [], agg: null }, { status: 500 });
  }
}
