import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = "your-secret-key";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (username === "admin" && password === "mixanya") {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });

    return NextResponse.json({ token });
  }

  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}