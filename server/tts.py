import pyttsx3

engine = pyttsx3.init()

def convertTTS(text, file_loc, voice, rate):
    engine.setProperty('voice', voice)
    engine.setProperty('rate', rate)
    
    engine.save_to_file(text, file_loc)
    engine.runAndWait()

voices = engine.getProperty('voices')
for voice in voices:
    print(voice, voice.id)

voice_id = voices[1].id
rate = 200
    
# audio for title
with open('./title.txt', 'r', encoding='utf-8') as f:
    convertTTS(f.read().strip(), './tts_dumps/title.mp3', voice_id, rate)
# audio for body text
with open('./post.txt', 'r', encoding='utf-8') as f:
    convertTTS(f.read().strip(), './tts_dumps/post.mp3', voice_id, rate)