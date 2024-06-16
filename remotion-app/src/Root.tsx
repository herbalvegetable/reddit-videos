import { useState, useEffect } from 'react';
import { Composition } from 'remotion';
import { MyComposition } from './compositions/MyComposition';

const FPS = 30;

export const RemotionRoot: React.FC = () => {

  const USERNAME = 'QookieChip';
  const PROFILE_PIC_SRC = 'pfp_cookie.png';

  const [title, setTitle] = useState<string>('');
  const [titleDuration, setTitleDuration] = useState<number>(1);
  const [segments, setSegments] = useState<any[]>([]);
  const [postDuration, setPostDuration] = useState<number>(1);
  const [outroDuration, setOutroDuration] = useState<number>(1);
  const [outroSegments, setOutroSegments] = useState<any[]>([]);
  useEffect(() => {
    fetch(`http://localhost:5000/api/video-info`)
      .then(res => res.json()
        .then(videoData => {
          console.log('videoData: ', videoData);
          const { title, titleDuration, postDuration, outroDuration } = videoData;
          setTitle(title);
          setTitleDuration(titleDuration * FPS + (0.5 * FPS));
          setPostDuration(postDuration * FPS)
          setOutroDuration(outroDuration * FPS)
        })
        .catch(err => console.log(err)))
      .catch(err => console.log(err));

    fetch(`http://localhost:5000/api/stt/post`)
      .then(res => res.json()
        .then(postData => {
          console.log('Post Data: ', postData);
          let data = postData.segments.map((segment: any) => {
            const { start, end, text, words } = segment;
            return {
              start,
              end,
              text,
              words
            }
          })
          console.log(data);
          setSegments(data);
        })
        .catch(err => console.log(err)))
      .catch(err => console.log(err));

    fetch(`http://localhost:5000/api/stt/outro`)
      .then(res => res.json()
        .then(outroData => {
          console.log('Outro Data: ', outroData);
          let data = outroData.segments.map((segment: any) => {
            const { start, end, text, words } = segment;
            return {
              start,
              end,
              text,
              words
            }
          })
          console.log(data);
          setOutroSegments(data);
        })
        .catch(err => console.log(err)))
      .catch(err => console.log(err));
}, []);

return (
  <>
    <Composition
      id="MyComposition"
      component={MyComposition}
      durationInFrames={Math.ceil(titleDuration + postDuration + outroDuration + (FPS * 5)) || 1}
      fps={FPS}
      width={1280}
      height={720}
      defaultProps={{
        username: USERNAME,
        pfpSrc: PROFILE_PIC_SRC,

        title,
        titleDuration, // title duration in frames
        segments,

        postDuration, // post duration in frames

        outroDuration, // outro duration in frames
        outroSegments,
      }}
    />
  </>
);
};
