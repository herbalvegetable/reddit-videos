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

with open('./post.txt', 'r', encoding='utf-8') as f:
    convertTTS(f.read().strip(), './tts_dumps/speech.mp3', voices[1].id, 200)