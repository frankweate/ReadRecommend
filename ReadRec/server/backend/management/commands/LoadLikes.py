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
        ReviewLikes = pd.read_csv('../../Data/ReviewLikes.csv')
        for i, row in ReviewLikes.iterrows():
            u = User.objects.get(id = int(row['user']))
            r = Review.objects.get(rId = row['review'])
            r.likes.add(u)
            r.save()
            if i % 10000 == 0:
                print('likes {} of {}'.format(int(i),int(len(ReviewLikes))))