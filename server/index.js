const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const ms = require('mediaserver');
// const bgVideoBucket = require('./aws-buckets/bg-videos');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
    console.log(`Server listening to port ${port}`);
});

app.use(cors());

app.get('/api/video-data', async (req, res) => {
    let durationInfoData = JSON.parse(fs.readFileSync(`./duration_info.json`, { encoding: 'utf-8', flag: 'r' }));

    let outroTranscriptData = JSON.parse(fs.readFileSync(`./stt_dumps/outro.json`, { encoding: 'utf-8', flag: 'r' }));

    let videoData = {
        posts: [],
        outroDuration: durationInfoData.outro,
        outroSegments: outroTranscriptData.segments.map(segment => {
            const { start, end, text, words } = segment;
            return { start, end, text, words }
        }),
        totalDuration: durationInfoData.total,
    }

    for (let i = 0; i < 3; i++) {
        let postIndex = i + 1
        let title = fs.readFileSync(`./posts/${postIndex}/title.txt`, { encoding: 'utf-8', flag: 'r' });

        let postTranscriptData = JSON.parse(fs.readFileSync(`./stt_dumps/${postIndex}/post.json`, { encoding: 'utf-8', flag: 'r' }));
        let segueTranscriptData = JSON.parse(fs.readFileSync(`./stt_dumps/${postIndex}/segue.json`, { encoding: 'utf-8', flag: 'r' }));

        postData = {
            title,
            titleDuration: durationInfoData.posts[i].title,
            postDuration: durationInfoData.posts[i].post,
            segments: postTranscriptData.segments.map(segment => {
                const { start, end, text, words } = segment;
                return { start, end, text, words }
            }),
            segue: {
                segueDuration: durationInfoData.posts[i].segue,
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

// function getRandItem(arr) {
//     return arr[Math.floor(Math.random() * arr.length)];
// }
// let fileKeys = ['minecraft1', 'minecraft2'];
// app.get('/api/video', async (req, res) => {
//     const { getFile } = bgVideoBucket;
//     let fileName = fileKeys[0];
//     try {
//         const readStream = await getFile(`${fileName}.mp4`);
//         console.log(readStream);
//         // readStream.pipe(res);

//         // cut video to random time (for variety)
//         res.header('Content-Disposition', `attachment; filename=${fileName}.mp4`);
//         ffmpeg(readStream)
//             .seekInput('00:00:10')
//             .setDuration('05:00')
//             .toFormat('mp4')
//             .on('error', (err, stdout, stderr) => {
//                 console.log('an error happened: ' + err.message);
//                 console.log('ffmpeg stdout: ' + stdout);
//                 console.log('ffmpeg stderr: ' + stderr);
//             })
//             .pipe(res, {end: true});

//     }
//     catch (err) {
//         console.log(err);
//     }
// });