import os
from praw import Reddit
import random
import string
import re
import json

from dotenv import load_dotenv
load_dotenv()

from clear_folder import clear_folder
posts_dir = './posts'
clear_folder(posts_dir)
for i in range(3):
    path = os.path.join(posts_dir, f'{i+1}')
    os.mkdir(path)

def get_rand_item(my_list):
    return my_list[random.randint(0, len(my_list)-1)]

reddit = Reddit(
    client_id=os.environ['REDDIT_API_CLIENT_ID'],
    client_secret=os.environ['REDDIT_API_CLIENT_SECRET'],
    user_agent=f'my-app by {os.environ['REDDIT_API_USERNAME']}',
    username=os.environ['REDDIT_API_USERNAME'],
    password=os.environ['REDDIT_API_PASSWORD'],
)

sub_list = [
    'AITAH',
    'TIFU',
    'offmychest',
    'confession',
    'JUSTNOFAMILY',
    'entitledpeople',
    'entitledparents',
    'relationship_advice',
    'relationships',
]

def get_posts(sub_list):
    subreddit = reddit.subreddit('+'.join(sub_list))

    top_submissions_of_year = list(subreddit.top(time_filter='year', limit=400))
    print(len(top_submissions_of_year))

    submission_filter = {
        'min_text_len': 2500, # in chars
        'min_score': 300, # min upvotes
    }
    filtered_posts = []

    print(f'Fetching top reddit posts...')
    for index, submission in enumerate(top_submissions_of_year):
        if len(submission.selftext) < submission_filter['min_text_len'] or submission.score < submission_filter['min_score'] or submission.stickied: # exclude stickied posts
            print(f'X: Len:{len(submission.selftext)} | Score:{submission.score}')
            continue
        
        printable = set(string.printable)
        title = ''.join(list(filter(lambda x: x in printable, submission.title)))
        text = ''.join(list(filter(lambda x: x in printable, submission.selftext)))
        text = re.sub(
                '(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})',
                '',
                text) # remove links
        # print(text)
        
        post = {
            'title': title,
            'text': text,
            'score': submission.score,
            'nsfw': submission.over_18,
            'id': submission.id,
        }
        filtered_posts.append(post)
        
        print(f'{index+1}/{len(top_submissions_of_year)}: filtered({len(filtered_posts)}): ^{submission.score} | {submission.title}{' | NSFW' if submission.over_18 else ''} | {submission.id}')
        
    print(f'Total filtered posts: {len(filtered_posts)}')

    posts = []

    for post_index in range(1, 4):
        rand_post = get_rand_item(filtered_posts)
        posts.append(rand_post)
        
        print(f'\nSelected post: {rand_post['title']} ({len(rand_post['text'])}) ^{rand_post['score']}')

        # segue
        with open(f'./posts/{post_index}/segue.txt', 'w') as f:
            suffix = {
                1: 'st',
                2: 'nd',
                3: 'rd',
            }
            f.write(f'{post_index}{'th' if post_index not in suffix else suffix[post_index]} story')
        # title
        with open(f'./posts/{post_index}/title.txt', 'w') as f:
            f.write(rand_post['title'].replace('&#x200B;', ''))
            print('Written to title.txt')
        # post
        with open(f'./posts/{post_index}/post.txt', 'w') as f:
            f.write(rand_post['text'].replace('&#x200B;', ''))
            print('Written to post.txt')
    
    return posts

# get title & description of video
posts = get_posts(sub_list)

upload_data = dict(
        file='./remotion-app/out/myComposition.mp4',
        thumbnail='./remotion-app/out/thumbnail.png',
        title=posts[0]['title'],
        description=f'1st story:\\n{posts[0]['title']} \\n\\n2nd story:\n{posts[1]['title']} \n\n3rd story:\n{posts[2]['title']} \n\nreddit stories,reddit stories to fall asleep to,reddit scary stories,reddit aita,reddit asmr,reddit aita compilation,reddit aita compilation,reddit bad parents,reddit breakup stories',
        keywords='reddit stories,reddit stories to fall asleep to,reddit scary stories,reddit aita,reddit asmr,reddit aita compilation,reddit aita compilation,reddit bad parents,reddit breakup stories',
        category='24',
        privacyStatus='public',
    )
    
# Create upload_data.json
with open(f'./upload_data.json', 'w', encoding='utf-8') as f:
    json.dump(upload_data, f)
    
