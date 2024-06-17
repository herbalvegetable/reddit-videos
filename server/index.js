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

app.get('/api/video-data', async (req, res) => {
    let outroTranscriptData = JSON.parse(fs.readFileSync(`./stt_dumps/outro.json`, { encoding: 'utf-8', flag: 'r' }));

    let videoData = {
        posts: [],
        outroDuration: await getAudioDurationInSeconds('./tts_dumps/outro.mp3'),
        outroSegments: outroTranscriptData.segments.map(segment => {
            const { start, end, text, words } = segment;
            return { start, end, text, words }
        }),
    }


    for (let i = 0; i < 3; i++) {
        let postIndex = i + 1
        let title = fs.readFileSync(`./posts/${postIndex}/title.txt`, { encoding: 'utf-8', flag: 'r' });

        let postTranscriptData = JSON.parse(fs.readFileSync(`./stt_dumps/${postIndex}/post.json`, { encoding: 'utf-8', flag: 'r' }));
        let segueTranscriptData = JSON.parse(fs.readFileSync(`./stt_dumps/${postIndex}/segue.json`, { encoding: 'utf-8', flag: 'r' }));

        postData = {
            title,
            titleDuration: await getAudioDurationInSeconds(`./tts_dumps/${postIndex}/title.mp3`),
            postDuration: await getAudioDurationInSeconds(`./tts_dumps/${postIndex}/post.mp3`),
            segments: postTranscriptData.segments.map(segment => {
                const { start, end, text, words } = segment;
                return { start, end, text, words }
            }),
            segue: {
                segueDuration: await getAudioDurationInSeconds(`./tts_dumps/${postIndex}/segue.mp3`),
                segments: segueTranscriptData.segments.map(segment => {
                    const { start, end, text, words } = segment;
                    return { start, end, text, words }
                }),
            }
        }

        videoData.posts.push(postData);
    }

    res.send(videoData);
});

// serve audio files
for (let i = 0; i < 3; i++) {
    let postIndex = i + 1;
    app.get(`/api/audio/${postIndex}/segue`, async (req, res) => ms.pipe(req, res, `./tts_dumps/${postIndex}/segue.mp3`));
    app.get(`/api/audio/${postIndex}/title`, async (req, res) => ms.pipe(req, res, `./tts_dumps/${postIndex}/title.mp3`));
    app.get(`/api/audio/${postIndex}/post`, async (req, res) => ms.pipe(req, res, `./tts_dumps/${postIndex}/post.mp3`));
}
app.get('/api/audio/outro', async (req, res) => ms.pipe(req, res, './tts_dumps/outro.mp3'));

// serve video files
app.use('/bg-videos', express.static(path.join(__dirname, 'bg-videos')));