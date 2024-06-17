# 1
import json
from tiktokvoice import tts
from pydub import AudioSegment
import os
import re

from clear_folder import clear_folder

def getRandItem(my_list):
    return my_list[random.randint(0, len(my_list)-1)]

def convertTTS(text_prompt, file_loc, voice):
    try:
        tts(text_prompt, voice, file_loc)
    except Exception as e:
        print(e)

voice_ids = ['en_uk_003', 'en_us_007']
voice_id = voice_ids[1]

paragraph_num = 0

def generateSegueAudio(post_index):
    # audio for segue
    with open(f'./posts/{post_index}/segue.txt', 'r', encoding='utf-8') as f:
        convertTTS(f.read().strip(), f'./tts_dumps/{post_index}/segue.mp3', voice_id)
        print(f'Post {post_index}: TTS for segue completed!')

def generateTitleAudio(post_index):
    # audio for title
    with open(f'./posts/{post_index}/title.txt', 'r', encoding='utf-8') as f:
        convertTTS(f.read().strip().replace('*', ''), f'./tts_dumps/{post_index}/title.mp3', voice_id)
        print(f'Post {post_index}: TTS for title completed!')

def generatePostAudio(post_index):
    # audio for body text
    with open(f'./posts/{post_index}/post.txt', 'r', encoding='utf-8') as f:
        text = f.read().strip().replace('*', '') # remove tts reading * in audio
        lines = [line for line in re.split('[.\n]+', text) if line != ''] # remove blank spaces
        
        n = 2 # no. of lines per para
        paragraphs = ['.\n'.join(lines[i:i+n]) for i in range(0, len(lines), n)] # each para contains n lines
        print(paragraphs)
        paragraph_num = len(paragraphs)
        print(paragraph_num)
        
        for index, para in enumerate(paragraphs):
            file_loc = f'./tts_post_pts/{post_index}/post_pt{index+1}.mp3'
            if os.path.isfile(file_loc):
                print(f'({index+1}/{paragraph_num}) Part {index+1} already generated. Skipping...')
                continue
            
            convertTTS(para, file_loc, voice_id)
            print(f'Post {post_index}: ({index+1}/{paragraph_num}) TTS for part {index+1} completed!')

    # combine audio parts into a single audio file (post.mp3)
    post_audio = None
    for i in range(paragraph_num):
        audio = AudioSegment.from_mp3(f'./tts_post_pts/{post_index}/post_pt{i+1}.mp3')
            
        if i == 0:
            post_audio = audio
            continue
        post_audio += audio
    post_audio.export(f'./tts_dumps/{post_index}/post.mp3', format='mp3')

def generateOutroAudio():
    # audio for outro
    with open('./outro.txt', 'r', encoding='utf-8') as f:
        convertTTS(f.read().strip(), './tts_dumps/outro.mp3', voice_id)
        print(f'TTS for outro completed!')

def generateAudioFiles():
    # clear tts_dumps folder contents
    tts_dir = './tts_dumps'
    clear_folder(tts_dir)
    for i in range(3):
        path = os.path.join(tts_dir, f'{i+1}')
        os.mkdir(path)
        
    # clear tts_dumps folder contents
    tts_post_pts_dir = './tts_post_pts'
    clear_folder(tts_post_pts_dir)
    for i in range(3):
        path = os.path.join(tts_post_pts_dir, f'{i+1}')
        os.mkdir(path)
    
    generateOutroAudio()
    
    # generate audio for 3 separate posts
    for i in range(3):
        post_index = i + 1
        generateSegueAudio(post_index)
        generateTitleAudio(post_index)
    
        is_gen_post = True
        while is_gen_post:
            try:
                generatePostAudio(post_index)
                is_gen_post = False
                break
            except Exception as e:
                print('Error generating post audio, retrying...')
            
    # tts_dump.json info
    # with open(f'./tts_dumps/{post_index}/info.json', 'w', encoding='utf-8') as f:
    #     data = {
    #         'paragraph_num': paragraph_num
    #     }
    #     json.dump(data, f)

generateAudioFiles()
        


    
# 2

# from bark import SAMPLE_RATE, generate_audio, preload_models
# from scipy.io.wavfile import write as write_wav
# from pydub import AudioSegment

# preload_models()

# def convertTTS(text_prompt, file_loc, rate): # DO NOT ADD file extension to file_loc
#     wav_file_loc = f'{file_loc}.wav'
#     mp3_file_loc = f'{file_loc}.mp3'
    
#     audio_array = generate_audio(text_prompt)
#     write_wav(wav_file_loc, rate, audio_array)
    
#     AudioSegment.from_wav(wav_file_loc).export(mp3_file_loc, format="mp3")

# # audio for title
# with open('./title.txt', 'r', encoding='utf-8') as f:
#     convertTTS(f.read().strip(), './tts_dumps/title', rate)
# # audio for body text
# with open('./post.txt', 'r', encoding='utf-8') as f:
#     convertTTS(f.read().strip(), './tts_dumps/post', rate)

# 3

# from transformers import AutoProcessor, BarkModel
# from scipy.io.wavfile import write as write_wav
# from pydub import AudioSegment

# processor = AutoProcessor.from_pretrained("suno/bark")
# model = BarkModel.from_pretrained("suno/bark")

# def convertTTS(text_prompt, file_loc, voice_preset, rate=model.generation_config.sample_rate): # DO NOT ADD file extension to file_loc
#     inputs = processor(text_prompt, voice_preset=voice_preset)

#     audio_array = model.generate(**inputs)
#     audio_array = audio_array.cpu().numpy().squeeze()

#     wav_file_loc = f'{file_loc}.wav'
#     mp3_file_loc = f'{file_loc}.mp3'
#     write_wav(wav_file_loc, rate, audio_array)
#     AudioSegment.from_wav(wav_file_loc).export(mp3_file_loc, format="mp3")

# # audio for title
# with open('./title.txt', 'r', encoding='utf-8') as f: # DO NOT ADD file extension to file_loc
#     convertTTS(f.read().strip(), './tts_dumps/title', "v2/en_speaker_6")
# # audio for body text
# with open('./post.txt', 'r', encoding='utf-8') as f:
#     convertTTS(f.read().strip(), './tts_dumps/post', "v2/en_speaker_6")
    
# 4
# from gtts import gTTS

# def convertTTS(text_prompt, file_loc, language):
#     result = gTTS(text=text_prompt, lang=language, tld='us')
#     result.save(file_loc)

# # audio for title
# with open('./title.txt', 'r', encoding='utf-8') as f:
#     convertTTS(f.read().strip(), './tts_dumps/title.mp3', "en")
# # audio for body text
# with open('./post.txt', 'r', encoding='utf-8') as f:
#     convertTTS(f.read().strip(), './tts_dumps/post.mp3', "en")
    