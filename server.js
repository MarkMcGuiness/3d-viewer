const express = require('express');
const multer = require('multer');
const path = require('path');
const { nanoid } = require('nanoid');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueFilename = `${nanoid()}-${file.originalname}`;
    req.uploadedFileName = uniqueFilename; // Store the filename in the request for later use
    cb(null, uniqueFilename);
  },
});

const upload = multer({ storage: storage });

// Map to store uploaded file details
const uploadedFiles = new Map();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const filePath = `/uploads/${req.uploadedFileName}`;
  const uniqueLink = `/view/${req.uploadedFileName}`;

  // Store the uploaded file information
  uploadedFiles.set(req.uploadedFileName, {
    filePath: filePath,
    originalName: req.file.originalname,
  });

  res.json({ fileUrl: uniqueLink });
});

app.get('/view/:filename', (req, res) => {
  const fileName = req.params.filename;
  const fileDetails = uploadedFiles.get(fileName);

  if (!fileDetails) {
    return res.status(404).send('File not found');
  }

  const filePath = path.join(__dirname, 'uploads', fileName);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('File not found');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
