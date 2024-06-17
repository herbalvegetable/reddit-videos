# 1. Default TTS

# import whisper_timestamped as whisper
# import json

# def transcribe_audio(audio_loc, output_loc):
#     audio = whisper.load_audio(audio_loc)
#     model = whisper.load_model('tiny', device='cpu')

#     result = whisper.transcribe(model, audio, language='en')
#     print('Successfully transcribed audio!')
    
#     # extend end duration of each segment to start of next segment
#     segments = result['segments']
#     for i in range(len(segments)):
#         if i == len(segments)-1:
#             continue
#         segments[i]['end'] = segments[i+1]['start'] - 0.01
        

#     with open(output_loc, 'w', encoding='utf-8') as f:
#         f.write(json.dumps(result, indent=2, ensure_ascii=False))
    
# transcribe_audio('./tts_dumps/post.mp3', './stt_dumps/post.json')

# 2. Whisper TTS

# import whisper
# from whisper.utils import get_writer
# import json

# def transcribe_audio(audio_loc, output_dir, word_options):
#     # transcribe audio
#     model = whisper.load_model('small', device='cpu')
#     result = model.transcribe(audio=audio_loc, language='en', word_timestamps=True, task="transcribe")
#     print('Transcribed audio!')
    
#     # modify result; extend end duration of each segment to start of next segment
#     segments = result['segments']
#     for i in range(len(segments)):
#         if i == len(segments)-1:
#             continue
#         segments[i]['end'] = segments[i+1]['start'] - 0.01
    
#     # format result acc to word options
#     json_writer = get_writer(output_format='json', output_dir=output_dir) #e.g. post.mp3 -> post.json
#     json_writer(result, audio_loc, word_options)
#     print(f'Formatted audio transcription for {audio_loc}: \nline_count: {word_options['max_line_count']}, line_width: {word_options['max_line_width']}')

# # post
# transcribe_audio(
#     './tts_dumps/post.mp3', 
#     './stt_dumps/', 
#     word_options = {
#         "highlight_words": False,
#         "max_line_count": 1,
#         "max_line_width": 20
#     })

# # outro
# transcribe_audio(
#     './tts_dumps/outro.mp3', 
#     './stt_dumps/', 
#     word_options = {
#         "highlight_words": False,
#         "max_line_count": 1,
#         "max_line_width": 20
#     })

# 3. Stable Whisper TTS
import stable_whisper
from whisper.utils import get_writer
import json
import os

from clear_folder import clear_folder
stt_dir = './stt_dumps'
clear_folder(stt_dir)
for i in range(3):
    path = os.path.join(stt_dir, f'{i+1}')
    os.mkdir(path)

def transcribe_audio(audio_loc, text, output_dir, word_options):
    # transcribe audio, align with original text
    model = stable_whisper.load_model('base')
    result = model.align(audio_loc, text, language='en').to_dict()
    print('Transcribed audio!')
    
    # modify result; extend end duration of each segment to start of next segment
    segments = result['segments']
    for i in range(len(segments)):
        if i == len(segments)-1:
            continue
        segments[i]['end'] = segments[i+1]['start'] - 0.01
    
    # format result acc to word options
    json_writer = get_writer(output_format='json', output_dir=output_dir) #e.g. post.mp3 -> post.json
    json_writer(result, audio_loc, word_options)
    print(f'Formatted audio transcription for {audio_loc}: \nline_count: {word_options['max_line_count']}, line_width: {word_options['max_line_width']}')

word_options = {
    "highlight_words": False,
    "max_line_count": 1,
    "max_line_width": 10
}

# generate 3 post & segue transcripts
for i in range(3):
    post_index = i+1
    
    # segue
    with open(f'./posts/{post_index}/segue.txt', 'r', encoding='utf-8') as f:
        transcribe_audio(
            f'./tts_dumps/{post_index}/segue.mp3',
            f.read().strip(),
            f'./stt_dumps/{post_index}/', 
            word_options=word_options)
    
    # post
    with open(f'./posts/{post_index}/post.txt', 'r', encoding='utf-8') as f:
        transcribe_audio(
            f'./tts_dumps/{post_index}/post.mp3',
            f.read().strip(),
            f'./stt_dumps/{post_index}/', 
            word_options=word_options)

# combine post transcripts into one json file
# posts_data = {"posts": []}
# for i in range(3):
#     post_index = i+1
#     with open(f'./stt_dumps/{post_index}/post.json', 'r') as f:
#         data = json.load(f)
#         posts_data['posts'].append(data)
# with open(f'./stt_dumps/posts.json', 'w') as f:
#     json.dump(posts_data, f)

# generate 1 outro transcript
with open(f'./outro.txt', 'r', encoding='utf-8') as f:
    transcribe_audio(
        './tts_dumps/outro.mp3',
        f.read().strip(),
        './stt_dumps/', 
        word_options=word_options)
    
