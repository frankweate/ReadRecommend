from django.template import Template, Context
from django.conf import settings
from backend.models import Catalog, Review, User
from django.core.management.base import BaseCommand
import pandas as pd
import random
import lorem
class Command(BaseCommand):
    help = 'Displays current time'

    def handle(self, *args, **kwargs):
        reviews = pd.read_csv('../../Data/ratings.csv')
        reviews = reviews.head(10000)
        reviews.columns = ['uID','bID','rating']
        reviews['review'] = 'Descriptions.....'
        u_id = list(set(reviews.uID))
        critic = [random.randint(0,1) for _ in range(0,len(u_id))]
        UserCritic = pd.DataFrame({'uID':u_id,'critic':critic})
        UserCritic.to_csv('../../Data/UserCritic.csv')
        reviews = reviews.merge(UserCritic,on='uID',how='left')
        likesno = [random.randint(0,10) for _ in range(0,len(reviews))]
        reviews['likesno'] = likesno
        likes = []
        likeuser = []
        likereview =[]
        print('reviews {}'.format(int(len(reviews))))
        j=0
        for i in range(0,len(reviews)):
            likeuser.extend(random.sample(u_id,reviews.loc[i,'likesno']))
            temp = [i] * reviews.loc[i,'likesno']
            likereview.extend(temp)
            likes.append([i])
            if i % 10000 == 0:
                print('reviews {}'.format(int(i)))
        reviews['likes'] = likes
        ReviewLikes = pd.DataFrame({'user':likeuser,'review':likereview})
        ReviewLikes.to_csv('../../Data/ReviewLikes.csv')
        for i, row in reviews.iterrows():
            row['review'] = lorem.sentence()
            c = Catalog.objects.get(bID = row['bID'])
            u = User.objects.get(id = row['uID'])
            p = Review(rId = i, bID = c,uID = u,rating = row['rating'],critic = row['critic'],review = row['review'],likesno = row['likesno'])
            p.save()
            if i % 10000 == 0:
                print('likes {} of {}'.format(int(i),int(len(reviews))))