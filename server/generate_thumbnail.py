import os
from PIL import Image, ImageFont, ImageDraw

bg_width, bg_height = 1280, 720

# image
bg = Image.new('RGB', (bg_width, bg_height), (255, 255, 255))
bg_draw = ImageDraw.Draw(bg)

# white background
# bg_draw.rectangle(((0, 0), (bg_width, bg_height)), fill='white')

def add_corners(im, rad):
    circle = Image.new('L', (rad * 2, rad * 2), 0)
    draw = ImageDraw.Draw(circle)
    draw.ellipse((0, 0, rad * 2 - 1, rad * 2 - 1), fill=255)
    alpha = Image.new('L', im.size, 255)
    w, h = im.size
    alpha.paste(circle.crop((0, 0, rad, rad)), (0, 0))
    alpha.paste(circle.crop((0, rad, rad, rad * 2)), (0, h - rad))
    alpha.paste(circle.crop((rad, 0, rad * 2, rad)), (w - rad, 0))
    alpha.paste(circle.crop((rad, rad, rad * 2, rad * 2)), (w - rad, h - rad))
    im.putalpha(alpha)
    return im

# profile pic
pfp = Image.open('./media/profile_pic.png')
pfp = pfp.resize((150, 150), Image.LANCZOS)
print(pfp.size)
pfp = add_corners(pfp, 100)
bg.paste(pfp, (150, 80))

# title
title = ''
with open('./posts/1/title.txt', 'r', encoding='utf-8') as f:
    title = f.read()
roboto_font = ImageFont.truetype('./fonts/Roboto-Bold.ttf', 50)

def get_wrapped_text(text: str, font: ImageFont.ImageFont,
                     line_length: int):
        lines = ['']
        for word in text.split():
            line = f'{lines[-1]} {word}'.strip()
            if font.getlength(line) <= line_length:
                lines[-1] = line
            else:
                lines.append(word)
        return '\n'.join(lines)
title = get_wrapped_text(title, font=roboto_font, line_length=1050)
_, _, title_w, title_h = bg_draw.textbbox((0, 0), title, font=roboto_font)
bg_draw.text(
    ((bg_width - title_w)/2, (bg_height - title_h)/2), 
    title, 
    fill='black', 
    font=roboto_font
    )

# bottom actions


bg.show()