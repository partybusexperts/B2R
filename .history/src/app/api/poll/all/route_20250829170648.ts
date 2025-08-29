import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

const DATA_FILE = path.join(process.cwd(), "data", "polls.json");

async function readData() {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { polls: [], votes: {} };
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function GET() {
  const data = await readData();
  return NextResponse.json({ polls: data.polls || [], votes: data.votes || {} });
}
