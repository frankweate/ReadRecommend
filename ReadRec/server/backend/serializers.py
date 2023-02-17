
# import serializer from rest_framework
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *

# Create a model serializer
class UserSerializer(serializers.HyperlinkedModelSerializer):
    # specify model and fields
    class Meta:
        model = User
        fields = ('username', 'id')

class CategorySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Category
        fields = ('category',)

# Create a model serializer
class BookSerializer(serializers.HyperlinkedModelSerializer):
    categories = CategorySerializer(many=True, read_only=True)
    class Meta:
        model = Catalog
        fields = ('bID', 'name', 'author', 'description', 'image_url', 'image', 'categories')

class BookSerializerId(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Catalog
        fields = ('bID', 'name', 'author', 'description', 'image_url', 'image')

# Create a model serializer
class SearchBookSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.CharField(source='bID')
    image_url = serializers.CharField(source='image')
    #categories = CategorySerializer(many=True, read_only=True)
    categories = serializers.ListField(
        source='get_categories',
        child=serializers.CharField()
    )
    class Meta:
        model = Catalog
        fields = ('id', 'name', 'author', 'image_url', 'categories')

class ReviewSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Review
        fields = ('rId',)

#Collections -------------------------------------------------------
class CollectionSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.CharField(source='cID')
    amount = serializers.IntegerField(source='books_count')
    class Meta:
        model = Collection
        fields = ('id', 'name', 'amount')

class CollectionBookSerializer(serializers.HyperlinkedModelSerializer):
    bid = serializers.CharField(source='bID')
    image_url = serializers.CharField(source='image')
    rating = serializers.CharField(source='get_rating')
    class Meta:
        model = Catalog
        fields = ('name', 'author', 'bid', 'rating', 'image_url')

class BookRecommendSerializer(serializers.HyperlinkedModelSerializer):
    bid = serializers.CharField(source='bID')
    image_url = serializers.CharField(source='image')
    class Meta:
        model = Catalog
        fields = ('bid', 'name', 'image_url')

class ReminderSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.CharField(source='rID')
    name = serializers.CharField(source='get_name')
    text = serializers.CharField(source='get_description')
    is_challenge = serializers.CharField(source='get_is_challenge')
    cid = serializers.IntegerField(source='get_collection')
    class Meta:
        model = Reminder
        fields = ('id', 'name', 'text', 'is_challenge', 'cid')
