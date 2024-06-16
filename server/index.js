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
    let titleDuration = await getAudioDurationInSeconds('./tts_dumps/1/title.mp3');
    let postDuration = await getAudioDurationInSeconds('./tts_dumps/1/post.mp3');
    let outroDuration = await getAudioDurationInSeconds('./tts_dumps/outro.mp3');
    console.log({titleDuration, postDuration, outroDuration});

    fs.readFile('./posts/1/title.txt', 'utf8', (err, data) => {
        if(err){
            console.log(err);
            return;
        }
        res.send({
            title: data, 
            titleDuration,
            postDuration,
            outroDuration,
        });
    });
});
app.get('/api/upload', async(req, res) => {

})

// serve subtitle data (words with timestamps)
postFilePath = path.join(__dirname, 'stt_dumps/1/post.json');
app.get('/api/stt/post', async (req, res) => { 
    let readStream = fs.createReadStream(postFilePath);
    readStream.pipe(res);
});

outroFilePath = path.join(__dirname, 'stt_dumps/outro.json');
app.get('/api/stt/outro', async (req, res) => { 
    let readStream = fs.createReadStream(outroFilePath);
    readStream.pipe(res);
});

// serve audio files
app.get('/api/audio/title', async(req, res) => ms.pipe(req, res, './tts_dumps/1/title.mp3'));
app.get('/api/audio/post', async(req, res) => ms.pipe(req, res, './tts_dumps/1/post.mp3'));
app.get('/api/audio/outro', async(req, res) => ms.pipe(req, res, './tts_dumps/outro.mp3'));

// serve video files
app.use('/bg-videos', express.static(path.join(__dirname, 'bg-videos')));