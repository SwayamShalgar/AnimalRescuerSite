import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';
import nodemailer from 'nodemailer';

export async function GET(req) {
  const url = new URL(req.url);
  const staffid = url.searchParams.get('staffid');

  try {
    const client = await pool.connect();

    const activeQuery = `
      SELECT r.requestid, r.requestbody, r.location, a.name, a.breed, a.species, a.imageurl
      FROM request r
      INNER JOIN animaldetails a ON r.requestid = a.requestid
      WHERE r.status = 'active'
    `;

    const acceptedQuery = `
      SELECT r.requestid, r.requestbody, r.location, a.name, a.breed, a.species, a.imageurl, r.status
      FROM request r
      INNER JOIN animaldetails a ON r.requestid = a.requestid
      WHERE r.status = 'pending' AND r.staffid = $1
    `;

    const clientResult = await client.query(activeQuery);
    const accepted = staffid ? await client.query(acceptedQuery, [staffid]) : { rows: [] };

    client.release();

    return NextResponse.json({
      active: clientResult.rows,
      accepted: accepted.rows,
    });
  } catch (err) {
    console.error('Database fetch error:', err);
    return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const { requestid, staffid } = await req.json();
    const client = await pool.connect();

    await client.query(
      'UPDATE request SET status = $1, staffid = $2 WHERE requestid = $3',
      ['pending', staffid, requestid]
    );

    client.release();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Update error:', err);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { requestid } = await req.json();
    const client = await pool.connect();

    // 1. Fetch all necessary details for email before deleting
    const result = await client.query(`
      SELECT r.requestid, r.requestbody, r.location, a.name, a.breed, a.species, a.imageurl,
             u.email
      FROM request r
      INNER JOIN animaldetails a ON r.requestid = a.requestid
      INNER JOIN users u ON r.userid = u.userid
      WHERE r.requestid = $1
    `, [requestid]);

    if (result.rowCount === 0) {
      client.release();
      return NextResponse.json({ error: 'Request not found.' }, { status: 404 });
    }

    const data = result.rows[0];

    // 2. Send email to user
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: data.email,
      subject: 'Animal Rescue Completed',
      html: `
        <h2>Rescue Update</h2>
        <p>The animal you reported has been rescued successfully. Here are the details:</p>
        <ul>
          <li><strong>Name:</strong> ${data.name}</li>
          <li><strong>Breed:</strong> ${data.breed}</li>
          <li><strong>Species:</strong> ${data.species}</li>
          <li><strong>Description:</strong> ${data.requestbody}</li>
          <li><strong>Location:</strong> ${data.location}</li>
        </ul>
        <img src="${data.imageurl}" alt="Animal Image" style="max-width:500px;"/>
        <p>Thank you for reporting and helping save lives!</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    // 3. Delete animal and request after email is sent
    const animalid = await client.query(
      'SELECT animalid FROM animaldetails WHERE requestid = $1',
      [requestid]
    );

    if (animalid.rowCount > 0) {
      await client.query('DELETE FROM animaldetails WHERE animalid = $1', [animalid.rows[0].animalid]);
    }

    await client.query('DELETE FROM request WHERE requestid = $1', [requestid]);

    client.release();

    return NextResponse.json({ success: true, message: 'Email sent, request completed and deleted.' });
  } catch (err) {
    console.error('Delete error:', err);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
