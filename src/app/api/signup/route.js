import pool from "../../../../lib/db";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(request) {
  const body = await request.json();
  const { username, email, password } = body;

  if (!username || !email || !password) {
    return NextResponse.json({ message: "All fields required." }, { status: 400 });
  }

  try {
    const client = await pool.connect();

    const result = await client.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING userid, name, email",
      [username, email, password]
    );

    const user = result.rows[0];
    client.release();

    // Create JWT
    const token = jwt.sign(
      { userId: user.userid, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("Generated JWT:", token);

    // Set token as HTTP-only cookie
    const response = NextResponse.json({ user });

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
