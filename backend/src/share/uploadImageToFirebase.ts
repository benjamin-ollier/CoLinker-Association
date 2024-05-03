import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';
import { Request } from 'express';
import { Readable } from 'stream';


/**
 * Uploads an image to Firebase Storage and returns the public URL.
 *
 * @param {Buffer} buffer - The buffer containing image data.
 * @param {string} originalName - The original file name of the image.
 * @returns {Promise<string>} The public URL of the uploaded image.
 */
export async function uploadImageToFirebase(buffer: Buffer, originalName: string): Promise<string> {
    const bucket = admin.storage().bucket();
    const fileName = `dashboard/${Date.now()}-${originalName}`;
    const file = bucket.file(fileName);

    const stream = new Readable({
      read() {}
    });
    stream.push(buffer);
    stream.push(null);

    await new Promise((resolve, reject) => {
        stream.pipe(file.createWriteStream({
        }))
        .on('error', reject)
        .on('finish', resolve);
    });

    const signedUrls = await file.getSignedUrl({
        action: 'read',
        expires: '03-09-2491',
    });

    return signedUrls[0];
}

