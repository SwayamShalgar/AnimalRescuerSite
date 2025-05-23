import pool from "../../../../lib/db";

export async function POST(req) {
  const { email, name, center_id } = await req.json();

  if (!email || !name || !center_id) {
    return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
  }

  try {
    const client = await pool.connect();

    // Check for existing staff with same email and center_id
    const existing = await client.query(
      `SELECT * FROM staff WHERE email = $1 AND centerid = $2`,
      [email, center_id]
    );

    if (existing.rows.length > 0) {
      client.release();
      return new Response(JSON.stringify({ error: "Staff already exists" }), {
        status: 409,
      });
    }

    const result = await client.query(
      `INSERT INTO staff (email, name, centerid) VALUES ($1, $2, $3) RETURNING *`,
      [email, name, center_id]
    );

    client.release();
    return new Response(JSON.stringify({ message: "Signup successful", staff: result.rows[0] }), {
      status: 201,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Signup failed", details: err.message }), {
      status: 500,
    });
  }
}
