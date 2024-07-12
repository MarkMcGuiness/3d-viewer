const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;
const upload = multer({ dest: 'uploads/' });

// Serve static files
app.use(express.static('public'));

// Endpoint to handle file upload
app.post('/upload', upload.single('model'), (req, res) => {
    const file = req.file;
    const uniqueId = uuidv4();
    const newPath = path.join(__dirname, 'uploads', uniqueId + path.extname(file.originalname));

    fs.rename(file.path, newPath, (err) => {
        if (err) return res.status(500).send('Error occurred');
        const modelUrl = `http://localhost:${PORT}/view/${uniqueId}`;
        res.send({ modelUrl });
    });
});

// Endpoint to view the model
app.get('/view/:id', (req, res) => {
    const modelPath = path.join(__dirname, 'uploads', req.params.id + '.glb');
    if (fs.existsSync(modelPath)) {
        res.sendFile(path.join(__dirname, 'public', 'viewer.html'));
    } else {
        res.status(404).send('Model not found');
    }
});

// Serve the 3D model file
app.get('/model/:id', (req, res) => {
    const modelPath = path.join(__dirname, 'uploads', req.params.id + '.glb');
    if (fs.existsSync(modelPath)) {
        res.sendFile(modelPath);
    } else {
        res.status(404).send('Model not found');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
