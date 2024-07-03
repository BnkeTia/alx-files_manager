import Bull from 'bull';
import { ObjectId } from 'mongodb';
import dbClient from './utils/db';
import imageThumbnail from 'image-thumbnail';
import fs from 'fs';
import path from 'path';

const fileQueue = new Bull('fileQueue');

// Process the queue
fileQueue.process(async (job) => {
  const { fileId, userId } = job.data;

  if (!fileId) {
    throw new Error('Missing fileId');
  }

  if (!userId) {
    throw new Error('Missing userId');
  }

  const file = await dbClient.db.collection('files').findOne({ _id: new ObjectId(fileId), userId });

  if (!file) {
    throw new Error('File not found');
  }

  const filePath = file.localPath;

  try {
    const sizes = [500, 250, 100];
    for (const size of sizes) {
      const thumbnail = await imageThumbnail(filePath, { width: size });
      const thumbnailPath = path.join(path.dirname(filePath), `${path.basename(filePath, path.extname(filePath))}_${size}${path.extname(filePath)}`);
      fs.writeFileSync(thumbnailPath, thumbnail);
    }
  } catch (error) {
    throw new Error(`Error generating thumbnails: ${error.message}`);
  }
});

export default fileQueue;
