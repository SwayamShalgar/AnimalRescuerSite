import pool from "../../../../lib/db";

export async function POST(req) {
  const { email, center_id } = await req.json();

  if (!email || !center_id) {
    return new Response(JSON.stringify({ error: "Missing email or center ID" }), { status: 400 });
  }

  try {
    const client = await pool.connect();
    const result = await client.query(
      `SELECT * FROM staff WHERE email = $1 AND centerid = $2`,
      [email, center_id]
    );
    client.release();

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ error: "Staff not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Login successful", staff: result.rows[0] }), {
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Login failed", details: err.message }), {
      status: 500,
    });
  }
}
