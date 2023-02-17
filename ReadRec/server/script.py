# To be executed with: python3 manage.py shell < script.py
# File for testing django functionality

#from django.db import models
from backend.models import Catalog
from backend.models import Category
from backend.models import Review
from backend.models import ReviewLikes
from django.contrib.auth.models import User
from decimal import Decimal
import django.apps

# Serach refactor
app_models = django.apps.apps.get_models(include_auto_created=True, include_swapped=True)
print(app_models)
'''book = Catalog.objects.filter(categories__cID = 1).filter(name__icontains="z")
print(book)'''

# Rating score test
'''# Update a book to have rating 3.6
book = Catalog.objects.filter(bID = 1)[0]
book.user_rating = 3.6 #Decimal(3.6)
book.save()

book = Catalog.objects.filter(bID = 2)[0]
book.user_rating = 4.2 #Decimal(3.6)
book.save()'''


# ReviewLikes creating testing
'''
review_like = ReviewLikes.objects.get(user = 1, review = 1)
print(review_like)
review1 = Review.objects.get(rId = 1)
print(review1)

user1 = User.objects.get(id = 1)
print(user1.id)
try:
    review2 = Review.objects.get(rId = 2)
    print(review2)
except:
    pass
review_like = ReviewLikes.objects.get(user = 1, review = 1)
print(review_like)
newReviewLike = ReviewLikes(review = Review.objects.get(rId = 1), user = User.objects.get(id = 2))
print(newReviewLike.id)
newReviewLike.save()'''

#Category testing
'''print("hello")
book = Catalog.objects.all()[0]
print(book.name)
print(book.categories.all())

book = Catalog.objects.filter(bID = 1)[0]
print(book.name)
print(book.categories.all())
print(list(book.categories.all()))
print(book.get_categories())'''

'''
category = Category.objects.filter(cID = 0)[0]
print(category.category)
print(category.catalogs.all())'''

#print(book.categories)
