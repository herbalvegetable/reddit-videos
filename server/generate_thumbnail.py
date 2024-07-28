import os
from PIL import Image, ImageFont, ImageDraw, ImageOps

bg_width, bg_height = 1280, 720

# image
bg = Image.new('RGB', (bg_width, bg_height), (255, 255, 255))
bg_draw = ImageDraw.Draw(bg)

# white background
# bg_draw.rectangle(((0, 0), (bg_width, bg_height)), fill='white')

# profile pic
pfp_size = (130, 130)
pfp = Image.open('./media/pfp_circle3.png')
pfp = pfp.resize(pfp_size, Image.LANCZOS)
print(pfp.size)

# mask = Image.new('L', pfp_size, 0)
# draw = ImageDraw.Draw(mask)
# draw.ellipse((0, 0) + pfp_size, fill=255)

# output = ImageOps.fit(pfp, mask.size, centering=(0.5, 0.5))
# output.putalpha(mask)
bg.paste(pfp, (100, 80))

# title
title = ''
with open('./posts/1/title.txt', 'r', encoding='utf-8') as f:
    title = f.read()
roboto_font = ImageFont.truetype('./fonts/Roboto-Bold.ttf', 65)

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
    
title = get_wrapped_text(title, font=roboto_font, line_length=1100)
_, _, title_w, title_h = bg_draw.textbbox((0, 0), title, font=roboto_font, spacing=4)

text_x = (bg_width - title_w)/2
text_y = (bg_height - title_h)/2

bg_draw.text(
    (text_x, text_y + 10), 
    title, 
    fill='black', 
    font=roboto_font
    )

# bottom actions
def draw_upvote(layer):
    upvote_img = Image.open('./media/upvote.png')
    upvote_img = upvote_img.resize((60, 60), Image.LANCZOS)
    
    x = int(text_x)
    y = int(text_y + title_h + 40)
    layer.paste(upvote_img, (x, y))
    print((x, y))
    
    bg_draw.text(
        (x + 70, y), 
        '999+', 
        fill='#c95b16', 
        font=roboto_font
        )

draw_upvote(bg)

bg.show()

bg.save('./output-thumbnail/thumbnail.png')