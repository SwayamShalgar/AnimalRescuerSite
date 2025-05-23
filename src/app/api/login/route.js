import pool from '../../../../lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

export async function POST(request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return new Response(JSON.stringify({ message: 'All fields are required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const client = await pool.connect();

    const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);

    client.release();

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ message: 'User not found.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const user = result.rows[0];

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return new Response(JSON.stringify({ message: 'Invalid password.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ✅ JWT token generation
    const token = jwt.sign(
      { userId: user.userid, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    const cookie = serialize('token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production', // set to true in prod
    });

    return new Response(JSON.stringify({ message: 'Login successful.' }), {
      status: 200,
      headers: {
        'Set-Cookie': cookie,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({ message: 'Server error.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
