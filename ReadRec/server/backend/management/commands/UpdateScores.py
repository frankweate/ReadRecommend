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
        # Get all of the books
        for catalog in Catalog.objects.all():
            catalog.save()
