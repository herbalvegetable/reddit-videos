import { useState, useEffect } from 'react';
import { Composition } from 'remotion';
import { MyComposition } from './compositions/MyComposition';

const FPS = 30;
const USERNAME = 'QookieChip';
const PROFILE_PIC_SRC = 'pfp_cookie2.png';

export const RemotionRoot: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [totalPostDuration, setTotalPostDuration] = useState<number>(1);
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
          const { posts, outroDuration, outroSegments } = videoData;
          console.log('posts', posts);

          setPosts([...posts].map(post => {
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
          setTotalPostDuration(
            posts.reduce((duration: number, post: any) => duration + (post.titleDuration + post.postDuration + post.segue.segueDuration) * FPS, 0) - posts[0].segue.segueDuration // exclude first segue
          );
          setOutroDuration(outroDuration * FPS);
          setOutroSegments(outroSegments)
        })
        .catch(err => console.log(err)))
      .catch(err => console.log(err));
  }, []);

  return (
    <>
      <Composition
        id="MyComposition"
        component={MyComposition}
        durationInFrames={Math.ceil(totalPostDuration + outroDuration + (FPS * 5)) || 1}
        fps={FPS}
        width={1280}
        height={720}
        defaultProps={{
          username: USERNAME,
          pfpSrc: PROFILE_PIC_SRC,
          posts,
          totalPostDuration, // duration of all 3 posts
          outroDuration, // outro duration in frames
          outroSegments,
        }}
      />
    </>
  );
};
