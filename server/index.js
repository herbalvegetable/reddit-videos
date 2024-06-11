const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
    console.log(`Server listening to port ${port}`);
});

app.use(cors());

app.get('/api/video-info', async(req, res) => {
    
});

sttFilePath = path.join(__dirname, 'stt_dumps/stt_dump.json');
app.get('/api/stt', async (req, res) => {
    let readStream = fs.createReadStream(sttFilePath);
    readStream.pipe(res);
});