from django.template import Template, Context
from django.conf import settings
from backend.models import Catalog, Review, User
from django.core.management.base import BaseCommand
import pandas as pd
import random
import lorem
import names
class Command(BaseCommand):
    help = 'Displays current time'

    def handle(self, *args, **kwargs):
        chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@$#%0123456789'
        reviews = pd.read_csv('../../Data/ratings.csv')
        reviews = reviews.head(10000)
        reviews.columns = ['uID','bID','rating']
        reviews['review'] = 'Descriptions.....'
        u_id = list(set(reviews.uID))
        def password_checker(passwd):
                SpecialSym =['$', '@', '#', '%']
                result = True
                if (len(passwd) < 6) | len(passwd) > 20:
                    result = False
                if not any(char.isdigit() for char in passwd):
                    result = False
                if not any(char.isupper() for char in passwd):
                    result = False
                if not any(char.islower() for char in passwd):
                    result = False
                if not any(char in SpecialSym for char in passwd):
                    result = False
                return result
        print('users')
        json_string = '['
        i = 1
        for row in u_id:
            correct = False
            while not correct:
                password = ''
                for _ in range(0,random.randint(7,21)):
                    password += random.choice(chars)
                correct = password_checker(password)
            u = User(id = row,username =names.get_first_name()+str(i),password=password)
            u.save()
            if i % 10000 == 0:
                print('uid {} of {}'.format(int(i),int(len(u_id))))
            i += 1