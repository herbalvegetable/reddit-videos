import json
import subprocess

data = {}
with open('./upload_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

subprocess.run([
    "py", 
    "./upload_video.py", 
    '--file', data['file'], 
    '--thumbnail', data['thumbnail'], 
    '--title', data['title'],
    '--description', data['description'], 
    '--keywords', data['keywords'],
    '--category', data['category'],
    '--privacyStatus', data['privacyStatus'],
    # '--noauth_local_webserver',
    ], shell=True)