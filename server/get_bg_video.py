import boto3
import random
import os
import json
import math
from moviepy.editor import VideoFileClip

from dotenv import load_dotenv
load_dotenv()

from clear_folder import clear_folder

client = boto3.client(
    's3',
    aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
    aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
)

def download_video(client):
    clear_folder('./bg-videos')
    print('Cleared bg-videos folder')
    
    print('Downloading video...')
    bucket_name = os.environ['AWS_BGVIDEOS_BUCKET_NAME']

    bg_videos = ['minecraft1', 'minecraft2', 'minecraft3']
    def get_rand_item(arr):
        return arr[random.randint(0, len(arr)-1)]
    
    try:
        with open(f'./bg-videos/video.mp4', 'wb') as f:
            client.download_fileobj(bucket_name, f'{get_rand_item(bg_videos)}.mp4', f)
        
        print('Video successfully downloaded!')
    except Exception as e:
        print('Error downloading video')
        print(e)

download_video(client)

def get_post_duration():
    post_duration = 0
    with open('./duration_info.json', 'r', encoding='utf-8') as f:
        duration_info = json.load(f)
        post_duration = duration_info['total']
    return post_duration

def trim_video(vid_url, output_loc, trimmed_duration): #post_duration in seconds
    print('Trimming video...')
    clip = VideoFileClip(vid_url)
    rand_cut_time = 0
    
    if trimmed_duration > clip.duration:
        print('Post longer than clip; to be worked on')
        return 
    
    rand_cut_time = random.randrange(0, math.floor(clip.duration - trimmed_duration))
    print(f'Max range: {math.floor(clip.duration - trimmed_duration)}')
    print(f'Cut time: {rand_cut_time}')
    
    final_clip = clip.subclip(rand_cut_time, rand_cut_time + trimmed_duration)
    final_clip.write_videofile(output_loc)
    print(f'Trimmed video successfully created: {output_loc}')
    print(f'Total vid duration: {final_clip.duration}')

trim_video('./bg-videos/video.mp4', './bg-videos/final-video.mp4', get_post_duration() + 5)