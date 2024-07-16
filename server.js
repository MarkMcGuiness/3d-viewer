const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const app = express();
const port = process.env.PORT || 3000;

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const fileId = uuidv4();
    const extension = path.extname(file.originalname);
    cb(null, `${fileId}${extension}`);
  },
});

const upload = multer({ storage: storage });

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Handle file upload and generate URL
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const fileId = path.parse(req.file.filename).name; // Extract fileId from filename
  const modelUrl = `https://your-domain-name.com/view/${fileId}`; // Replace with your actual domain

  res.json({ modelUrl });
});

// Serve the 3D model viewer
app.get('/view/:fileId', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.fileId);

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    // Render HTML with a 3D model viewer (using Three.js or any other WebGL library)
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>3D Model Viewer</title>
        <script src="https://cdn.jsdelivr.net/npm/three@0.131.2/build/three.min.js"></script>
      </head>
      <body>
        <script>
          const scene = new THREE.Scene();
          const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
          const renderer = new THREE.WebGLRenderer();
          renderer.setSize(window.innerWidth, window.innerHeight);
          document.body.appendChild(renderer.domElement);
          
          const loader = new THREE.GLTFLoader();
          loader.load('${req.params.fileId}', function (gltf) {
            scene.add(gltf.scene);
          }, undefined, function (error) {
            console.error(error);
          });
          
          camera.position.z = 5;
          
          const animate = function () {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
          };
          
          animate();
        </script>
      </body>
      </html>
    `);
  } else {
    res.status(404).send('File not found');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
