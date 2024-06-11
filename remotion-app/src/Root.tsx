import { useState, useEffect } from 'react';
import { Composition } from 'remotion';
import { MyComposition } from './compositions/MyComposition';

const FPS = 30;

export const RemotionRoot: React.FC = () => {

	const [segments, setSegments] = useState<any[]>([]);
	const [endOfPost, setEndOfPost] = useState(20);
	useEffect(() => {
		fetch(`http://localhost:5000/api/stt`)
			.then(res => res.json()
				.then(sttData => {
					console.log(sttData);
					let data = sttData.segments.map((segment: any) => {
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
					setEndOfPost(Math.ceil(data?.slice(-1)?.pop()?.end * FPS));
				})
				.catch(err => console.log(err)))
			.catch(err => console.log(err))
	}, []);

	return (
		<>
			<Composition
				id="MyComposition"
				component={MyComposition}
				durationInFrames={endOfPost || 20}
				fps={FPS}
				width={1280}
				height={720}
				defaultProps={{
					segments,
				}}
			/>
		</>
	);
};