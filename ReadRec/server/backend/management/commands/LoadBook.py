from django.template import Template, Context
from django.conf import settings
from backend.models import Catalog
from django.core.management.base import BaseCommand
import pandas as pd
class Command(BaseCommand):
    help = 'Displays current time'

    def handle(self, *args, **kwargs):
        import lorem
        books = pd.read_csv('../../Data/books.csv')
        books = books[['book_id','authors','image_url','title','original_publication_year']]
        books['description'] = 'Descriptions.....'
        books.original_publication_year = books.original_publication_year.apply(str)
        books.columns = ['bID','author','image','name','year','description']
        for i, row in books.iterrows():
            row['description'] = lorem.text()
            p = Catalog(bID = row['bID'],author = row['author'],image = row['image'],name = row['name'],year = row['year'],description = row['description'])
            p.save()       