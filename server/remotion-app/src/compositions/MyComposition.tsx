import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  Img,
  staticFile,
  Audio,
  Video,
  OffthreadVideo,
} from 'remotion';
import styled from 'styled-components';
import React, { useState, useEffect, Fragment } from 'react';
import { BiSolidUpvote, BiComment } from 'react-icons/bi';

import '../font.css';

const Layout = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const TitleCard: React.FC<{ username: string, pfpSrc: string, text: string, index: number }> = ({ username, pfpSrc, text, index }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();
  // const opacity = interpolate(
  // 	frame,
  // 	[0, fps * 0.2],
  // 	[0, 1],
  // 	{ extrapolateRight: 'clamp', }
  // );
  const scale = spring({
    fps,
    frame,
    config: {
      // stiffness: 25,
      mass: 0.7,
    },
  });

  const Card = styled.div`
		text-align: left;
		width: 70%;
		background-color: white;
		border-radius: 10px;
		box-sizing: border-box;
		padding: 1em 1.5em;
		transform: scale(${index <= 0 ? 1 : scale});
	`;

  const reactions = [
    { ReactionIcon: BiSolidUpvote, colour: 'orange' },
    { ReactionIcon: BiComment },
  ]

  return (
    <Card>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: '1em',
      }}>
        <div style={{
          borderRadius: '50%',
          backgroundColor: 'gray',
          width: '70px',
          aspectRatio: '1/1',
          marginRight: '0.75em',
          overflow: 'hidden',
        }}>
          <Img style={{ width: '100%', height: '100%' }} src={staticFile(pfpSrc)} />
        </div>
        <div style={{
          fontSize: '2.2em',
        }}>{username}</div>
      </div>
      <div style={{
        fontSize: '3em',
        fontWeight: '600',
      }}>{text}</div>
      <div style={{ display: 'flex', flexDirection: 'row', paddingTop: '1.7em', paddingBottom: '0.7em' }}>
        {
          reactions.map((reaction, i) => {
            const { ReactionIcon, colour } = reaction;
            return (
              <div style={{
                display: 'flex',
                flexDirection: 'row',
                marginRight: '1.5em',
                alignItems: 'center',
                color: '#555',
              }} key={i.toString()}>
                <ReactionIcon color={colour} style={{ fontSize: '2.2em', marginRight: '0.25em' }} />
                <div style={{ fontSize: '1.7em' }}>99+</div>
              </div>
            )
          })
        }
      </div>
    </Card>
  )
}

const Watermark: React.FC<{ username: string, pfpSrc: string }> = ({ username, pfpSrc }) => {
  const Container = styled.div`
		display: flex;
		align-items: center;
		align-self: flex-start;
		flex-direction: row;
		opacity: 0.5;
		padding: 1em;
	`;
  const ImageContainer = styled.div`
		border-radius: 50%;
		background-color: gray;
		width: 50px;
		aspect-ratio: 1/1;
		margin-right: 0.75em;
		overflow: hidden;
	`
  return (
    <Container>
      <ImageContainer>
        <Img style={{ width: '100%', height: '100%' }} src={staticFile(pfpSrc)} />
      </ImageContainer>
      {/* <div style={{
				color: '#2b2b2b',
				fontSize: '1.5em',
				fontWeight: 'bold',
			}}>{username}</div> */}
    </Container>
  )
}

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

type MyCompositionProps = {
  username: string,
  pfpSrc: string,

  posts: Post[],
  totalDuration: number,

  outroDuration: number,
  outroSegments: Segment[],
}

export const MyComposition: React.FC<MyCompositionProps> = ({
  username,
  pfpSrc,
  posts,
  totalDuration,
  outroDuration,
  outroSegments,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  const Subtitle = styled.div`
    font-size: 3.5em;
    /* font-family: "Luckiest Guy", cursive; */
    font-family: "Rubik", sans-serif;
    font-weight: 900;
    color: white;
    width: 60%;
    text-align: center;
    -webkit-text-stroke-width: 3px;
    /* -webkit-text-stroke-color: #2b2b2b; */
    -webkit-text-stroke-color: black;
  `;

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Roboto", sans-serif',
        backgroundColor: '#2b2b2b',
      }}>
      {
        posts.map((post: Post, i: number) => {
          let postIndex = i + 1;

          const { title, titleDuration, postDuration, segments, segue } = post;
          let segueStart: number = i <= 0 ? 0 : posts.slice(0, i).reduce((duration: number, post: Post) => {
            // console.log({post, duration, titleDur: post.titleDuration, postDur: post.postDuration});
            return duration + Math.ceil(post.segue.segueDuration + post.titleDuration + post.postDuration); // previous posts
          }, 0);
          let titleStart: number = segueStart + (i <= 0 ? 0 : segue.segueDuration);
          let postStart: number = titleStart + titleDuration;
          // console.log({ titleStart, postStart, titleDuration });

          return (
            <Fragment key={i.toString()}>
              {
                i <= 0 ? null :
                  <>
                    {
                      segue.segments.map((segment: Segment, i: number) => {
                        const { start, end, text, words } = segment;
                        let startFrame = start * fps;
                        let duration = Math.max((end - start) * fps, 1);
                        return (
                          <Sequence from={segueStart + startFrame} durationInFrames={duration}>
                            <Layout>
                              <Subtitle>{text}</Subtitle>
                            </Layout>
                          </Sequence>
                        )
                      })
                    }
                    <Sequence from={segueStart} durationInFrames={segue.segueDuration} name={'Segue Audio'}>
                      <Audio volume={1} src={`http://localhost:5000/api/audio/${postIndex}/segue`} />
                    </Sequence>
                  </>
              }

              <Sequence from={titleStart} durationInFrames={titleDuration}>
                <Layout>
                  <TitleCard
                    username={username}
                    pfpSrc={pfpSrc}
                    text={title}
                    index={i} />
                </Layout>
                <Audio volume={1} src={`http://localhost:5000/api/audio/${postIndex}/title`} />
              </Sequence>
              {
                segments.map((segment: Segment, i: number) => {
                  const { start, end, text, words } = segment;
                  let startFrame = start * fps;
                  let duration = Math.max((end - start) * fps, 1);
                  if (duration <= 0) {
                    console.log('DURATION NEGATIVE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', duration);
                    console.log(post, segment);
                  }

                  return (
                    <Sequence from={postStart + startFrame} durationInFrames={duration} name={`Subt ${i + 1}`} key={i.toString()}>
                      <Layout>
                        <Subtitle>{text}</Subtitle>
                      </Layout>
                    </Sequence>
                  )
                })
              }
              <Sequence from={postStart} durationInFrames={postDuration} name="Post Audio">
                <Audio volume={1} src={`http://localhost:5000/api/audio/${postIndex}/post`} />
              </Sequence>
            </Fragment>
          )
        })
      }

      {
        outroSegments.map((segment: Segment, i: number) => {
          const { start, end, text, words } = segment;
          let startFrame = start * fps;
          let duration = (end - start) * fps;

          return (
            <Sequence from={totalDuration - outroDuration + fps*1 + startFrame} durationInFrames={duration} name={`Outro ${i + 1}`} key={i.toString()}>
              <Layout>
                <Subtitle>{text}</Subtitle>
              </Layout>
            </Sequence>
          )
        })
      }
      <Sequence from={totalDuration - outroDuration + fps*1} name="Outro Audio">
        <Audio volume={1} src={'http://localhost:5000/api/audio/outro'} />
      </Sequence>

      <Watermark username={username} pfpSrc={pfpSrc} />
      {/* <OffthreadVideo src={`http://localhost:5000/api/video`} /> */}
      <OffthreadVideo src={'http://localhost:5000/bg-videos/final-video.mp4'} />
    </AbsoluteFill>
  );
};
