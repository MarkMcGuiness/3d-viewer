const AWS = require('aws-sdk');
const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = process.env.PORT || 3000;

// Configure AWS SDK with your credentials
AWS.config.update({
  accessKeyId: process.env.AKIA2UC27CRZ4NJ2I4NG,
  secretAccessKey: process.env.QhnwxbhEUFmJc9V6P5COabjcL19SB7VvCvMuNKNs,
  region: process.env.us-east-2
});

const s3 = new AWS.S3();

const upload = multer({
  storage: multer.memoryStorage(), // Uploads file to memory
  limits: { fileSize: 5 * 1024 * 1024 } // Limit file size if needed
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  // Generate a unique identifier for the file
  const fileId = uuidv4();

  // Define params for uploading to S3
  const params = {
    Bucket: process.env.arcane-fortress-30772,
    Key: `${fileId}-${req.file.originalname}`,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
    ACL: 'public-read' // Allow public access to the uploaded file
  };

  // Upload file to S3
  s3.upload(params, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Failed to upload file to S3.');
    }

    // Construct the URL for accessing the file
    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;

    // Respond with the generated file URL
    res.json({ fileUrl });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
