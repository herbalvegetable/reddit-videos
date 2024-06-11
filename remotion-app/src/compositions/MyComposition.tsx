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
} from 'remotion';
import styled from 'styled-components';
import { useState, useEffect } from 'react';

import '../font.css';

const Layout = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const TitleCard: React.FC<{ username: string, text: string }> = ({ username, text }) => {
	const frame = useCurrentFrame();
	// const { fps, durationInFrames, width, height } = useVideoConfig();
	// const opacity = interpolate(
	// 	frame,
	// 	[0, fps * 1],
	// 	[0, 1],
	// 	{ extrapolateRight: 'clamp', }
	// );
	// const scale = spring({
	// 	fps,
	// 	frame
	// });

	const Card = styled.div`
		text-align: left;
		width: 70%;
		background-color: white;
		border-radius: 10px;
		box-sizing: border-box;
		padding: 1em 1.5em;
	`;

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
					<Img style={{ width: '100%', height: '100%' }} src={staticFile('drink.png')} />
				</div>
				<div style={{
					fontSize: '2.2em',
				}}>{username}</div>
			</div>
			<div style={{
				fontSize: '3em',
				fontWeight: '600',
			}}>{text}</div>
		</Card>
	)
}

type Props = {
	title: string,
	titleDuration: number,
	segments: any,
}
export const MyComposition: React.FC<Props> = ({ title, titleDuration, segments }) => {
	const { fps, durationInFrames, width, height } = useVideoConfig();

	const Subtitle = styled.div`
		font-size: 3.5em;
		font-family: "Luckiest Guy", cursive;
		color: white;
		width: 60%;
		text-align: center;
		-webkit-text-stroke-width: 3px;
		-webkit-text-stroke-color: #2b2b2b;
	`;

	return (
		<AbsoluteFill
			style={{
				alignItems: 'center',
				justifyContent: 'center',
				fontFamily: '"Roboto", sans-serif',
				backgroundColor: '#2b2b2b',
			}}>
			<Sequence durationInFrames={titleDuration}>
				<Layout>
					<TitleCard
						username="BlandCookie"
						text={title} />
				</Layout>
				<Audio volume={0.5} src={'http://localhost:5000/api/audio/title'} />
			</Sequence>
			<Video src={'http://localhost:5000/bg-videos/minecraft1.mp4'}/>
			{
				segments.map((segment: any, i: number) => {
					const { start, end, text, words } = segment;
					let startFrame = start * fps;
					let duration = (end - start) * fps;
					return (
						<Sequence from={titleDuration + startFrame} durationInFrames={duration} key={i.toString()}>
							<Layout>
								<Subtitle>{text}</Subtitle>
							</Layout>
						</Sequence>
					)
				})
			}
			<Sequence from={titleDuration}>
				<Audio volume={0.5} src={'http://localhost:5000/api/audio/post'} />
			</Sequence>
		</AbsoluteFill>
	);
};
