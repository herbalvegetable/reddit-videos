import { useState, useEffect } from 'react';
import { Composition } from 'remotion';
import { MyComposition } from './compositions/MyComposition';

const FPS = 30;
const USERNAME = 'QookieChip';
const PROFILE_PIC_SRC = 'pfp_cookie2.png';

export const RemotionRoot: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [totalDuration, setTotalDuration] = useState<number>(1);
  const [outroDuration, setOutroDuration] = useState<number>(1);
  const [outroSegments, setOutroSegments] = useState<Segment[]>([]);

  type Segment = {
    start: number,
    end: number,
    text: string,
    words: any[],
  }
  type Post = {
    title: string,
    titleDuration: number,
    postDuration: number,
    segments: Segment[],
    segue: any,
  }

  useEffect(() => {
    fetch(`http://localhost:5000/api/video-data`)
      .then(res => res.json()
        .then(videoData => {
          console.log('videoData: ', videoData);
          const { posts: postsData, outroDuration, outroSegments, totalDuration } = videoData;
          console.log('posts', postsData);

          setPosts([...postsData].map(post => {
            const { title, titleDuration, postDuration, segments, segue } = post;

            let newSegue = {...segue}
            newSegue.segueDuration *= FPS;

            let postData: Post = {
              title,
              titleDuration: titleDuration * FPS,
              postDuration: postDuration * FPS,
              segments,
              segue: newSegue,
            }
            return postData;
          }));
          setTotalDuration((totalDuration - postsData[0].segue.segueDuration) * FPS); // exclude first segue
          setOutroDuration(outroDuration * FPS);
          setOutroSegments(outroSegments);
        })
        .catch(err => console.log(err)))
      .catch(err => console.log(err));
  }, []);

  return (
    <>
      <Composition
        id="MyComposition"
        component={MyComposition}
        durationInFrames={Math.ceil(totalDuration + (FPS * 5)) || 1}
        fps={FPS}
        width={1280}
        height={720}
        defaultProps={{
          username: USERNAME,
          pfpSrc: PROFILE_PIC_SRC,
          posts,
          totalDuration, // duration of all 3 posts
          outroDuration, // outro duration in frames
          outroSegments,
        }}
      />
    </>
  );
};
