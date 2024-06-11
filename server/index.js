const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const ms = require('mediaserver');
const { getAudioDurationInSeconds } = require('get-audio-duration');

const app = express();
const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
    console.log(`Server listening to port ${port}`);
});

app.use(cors());

app.get('/api/video-info', async(req, res) => {
    let titleDuration = await getAudioDurationInSeconds('./tts_dumps/title.mp3');
    console.log({titleDuration});

    fs.readFile('./title.txt', 'utf8', (err, data) => {
        if(err){
            console.log(err);
            return;
        }
        res.send({title: data, titleDuration});
    });
});

// serve subtitle data (words with timestamps)
sttFilePath = path.join(__dirname, 'stt_dumps/post.json');
app.get('/api/stt', async (req, res) => { 
    let readStream = fs.createReadStream(sttFilePath);
    readStream.pipe(res);
});

// serve audio files
app.get('/api/audio/title', async(req, res) => ms.pipe(req, res, './tts_dumps/title.mp3'));
app.get('/api/audio/post', async(req, res) => ms.pipe(req, res, './tts_dumps/post.mp3'));

// serve video files
app.use('/bg-videos', express.static(path.join(__dirname, 'bg-videos')));