const AWS = require('aws-sdk');

const { S3Client, PutObjectCommand, GetObjectCommand,
    ListObjectsV2Command } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner") ; 

const crypto = require('crypto');

function uuid() {
  return crypto.randomBytes(16).toString('hex');
}

const id = uuid();


// const uuid = require("uuid") ;
require("dotenv").config();

const s3 = new S3Client();
const BUCKET = process.env.BUCKET;



// Set the AWS region and your access keys
AWS.config.update({
  region: 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const uploadToS3 = async ({ file, userId }) => {
  const key = `${userId}/${id}`;
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    region: 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  try {
    await s3.send(command);
    return { key }
  } catch (error) {
    console.error(error);
    return { error }
  }
};

const getImageKeysByUser = async (userId) => {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: userId,
    });
  
    const { Contents = [] } = await s3.send(command);
  
    return Contents.sort(
      (a, b) => new Date(b.LastModified) - new Date(a.LastModified)
    ).map((image) => image.Key);
  };
  
const getUserPresignedUrls = async (userId) => {
    try {
      const imageKeys = await getImageKeysByUser(userId);
  
      const presignedUrls = await Promise.all(
        imageKeys.map((key) => {
          const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
          return getSignedUrl(s3, command, { expiresIn: 900 }); // default
        })
      );
      return { presignedUrls };
    } catch (error) {
      console.log(error);
      return { error };
    }
  };

  module.exports = {
    uploadToS3,
    getImageKeysByUser,
    getUserPresignedUrls
  }


