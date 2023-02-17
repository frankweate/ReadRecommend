from django.template import Template, Context
from django.conf import settings
from backend.models import Catalog, Review, User, Category
from django.core.management.base import BaseCommand
import pandas as pd
import random
import lorem
import names
class Command(BaseCommand):
    help = 'Displays current time'

    def handle(self, *args, **kwargs):
        # Get all of the categories
        for category in Category.objects.all():
            category.save()
