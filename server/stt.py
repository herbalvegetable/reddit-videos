import whisper_timestamped as whisper
import json

def transcribe_audio(audio_loc, output_loc):
    audio = whisper.load_audio(audio_loc)
    model = whisper.load_model('tiny', device='cpu')

    result = whisper.transcribe(model, audio, language='en')
    print('Successfully transcribed audio!')
    
    # extend end duration of each segment to start of next segment
    segments = result['segments']
    for i in range(len(segments)):
        if i == len(segments)-1:
            continue
        segments[i]['end'] = segments[i+1]['start'] - 0.01
        

    with open(output_loc, 'w', encoding='utf-8') as f:
        f.write(json.dumps(result, indent=2, ensure_ascii=False))
    
transcribe_audio('./tts_dumps/post.mp3', './stt_dumps/post.json')