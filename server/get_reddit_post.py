import os
from praw import Reddit
import random
import string

from dotenv import load_dotenv
load_dotenv()

from clear_folder import clear_folder
posts_dir = './posts'
clear_folder(posts_dir)
for i in range(3):
    path = os.path.join(posts_dir, f'{i+1}')
    os.mkdir(path)

def getRandItem(my_list):
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

def getPost(sub_list, post_index):
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
        # print(text)
        
        post = {
            'title': title,
            'text': text,
            'score': submission.score,
            'nsfw': submission.over_18,
        }
        filtered_posts.append(post)
        
        print(f'{index+1}/{len(top_submissions_of_year)}: filtered({len(filtered_posts)}): ^{submission.score} | {submission.title}{' | NSFW' if submission.over_18 else ''}')
        
    print(f'Total filtered posts: {len(filtered_posts)}')

    rand_post = getRandItem(filtered_posts)
    print(f'\nSelected post: {rand_post['title']} ({len(rand_post['text'])}) ^{rand_post['score']}')

    # title
    with open(f'./posts/{post_index}/title.txt', 'w') as f:
        f.write(rand_post['title'].replace('&#x200B;', ''))
        print('Written to title.txt')
    # post
    with open(f'./posts/{post_index}/post.txt', 'w') as f:
        f.write(rand_post['text'].replace('&#x200B;', ''))
        print('Written to post.txt')

for i in range(3):
    getPost(sub_list, i+1)