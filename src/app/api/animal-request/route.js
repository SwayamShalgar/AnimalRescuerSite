import { NextResponse } from 'next/server';
import cloudinary from '../../../../lib/cloudinary';
import pool from '../../../../lib/db';
import { Readable } from 'stream';
import { randomUUID } from 'crypto';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  const formData = await req.formData();

  const animalName = formData.get('animalName');
  const description = formData.get('description');
  const location = formData.get('location');
  const breed = formData.get('bread');
  const species = formData.get('species');
  const file = formData.get('images');

  try {
    // ✅ Extract user from JWT cookie
    const token = await cookies().get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const userId = decoded.userId;
    console.log(userId);
    
    // ✅ Upload image to Cloudinary
    let imageUrl = null;

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());

      imageUrl = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'animal_images' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );

        Readable.from(buffer).pipe(uploadStream);
      });
    }

    const requestId = randomUUID();
    const animalId = randomUUID();

    // ✅ Insert into request with userId
    await pool.query(
      `INSERT INTO request (requestid, status,requestbody,userid,location)
       VALUES ($1, $2, $3, $4, $5)`,
      [requestId, 'active',description, userId, location]
    );

    // ✅ Insert into animaldetails with requestId
    await pool.query(
      `INSERT INTO animaldetails (animalid, name, breed, species, requestid, imageurl)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [animalId, animalName, breed, species, requestId, imageUrl]
    );

    return NextResponse.json({ message: 'Request submitted successfully!' });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
