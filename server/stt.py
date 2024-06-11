import whisper_timestamped as whisper
import json

def transcribe_audio(audio_loc, output_loc):
    audio = whisper.load_audio(audio_loc)
    model = whisper.load_model('tiny', device='cpu')

    result = whisper.transcribe(model, audio, language='en')
    print('Successfully transcribed audio!')

    with open(output_loc, 'w', encoding='utf-8') as f:
        f.write(json.dumps(result, indent=2, ensure_ascii=False))
    
transcribe_audio('./tts_dumps/speech.mp3', './stt_dumps/stt_dump.json')