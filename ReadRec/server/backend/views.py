from django.shortcuts import render

# Create your views here.

from django.shortcuts import render
from rest_framework import viewsets
from django.contrib.auth.models import User
from .serializers import UserSerializer, BookSerializer, SearchBookSerializer, BookSerializerId, CollectionSerializer, ReviewSerializer, CollectionBookSerializer, BookRecommendSerializer, ReminderSerializer

from rest_framework.permissions import IsAuthenticated


from .models import Catalog, Category, Review, ReviewLikes, Collection, Collection_Books, UserCritic, Reminder, Challenge

from rest_framework import generics
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import status
from rest_framework.authtoken.models import Token
import re
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import logout
import math
import pandas as pd
import numpy as np
from keras.callbacks import Callback, EarlyStopping, ModelCheckpoint
from keras.layers import Embedding, Reshape, concatenate, Dense, Input, Flatten
from keras.models import Model
# Import CF Model Architecture
from .modelskeleton import baseModel
import json
# Create your views here.

class UserViewSet(viewsets.ModelViewSet):
    """
    A simple ViewSet for viewing and editing accounts.
    """
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
    #serializer_class = UserSerializer(queryset, many=True)
    serializer_class = UserSerializer
    #permission_classes = [IsAccountAdminOrReadOnly]

class BookViewSet(viewsets.ModelViewSet):
    """
    A simple ViewSet for viewing and editing accounts.
    """
    #permission_classes = [IsAuthenticated]
    queryset = Catalog.objects.all()
    #serializer_class = UserSerializer(queryset, many=True)
    serializer_class = BookSerializer

'''class SearchView(generics.ListAPIView):
    #permission_classes = [IsAuthenticated]
    # According to django docs (https://docs.djangoproject.com/en/3.0/topics/db/queries/)
    # this is equivalent to limiting int SQL
    queryset = Catalog.objects.all()[:50]
    #serializer_class = UserSerializer(queryset, many=True)
    serializer_class = SearchBookSerializer'''

class SearchView(viewsets.ReadOnlyModelViewSet):
    permission_classes = (permissions.AllowAny,)
    #permission_classes = [IsAuthenticated]
    # According to django docs (https://docs.djangoproject.com/en/3.0/topics/db/queries/)
    # this is equivalent to limiting int SQL
    queryset = Catalog.objects.all()[:50]
    #serializer_class = UserSerializer(queryset, many=True)
    serializer_class = SearchBookSerializer

    def get_queryset(self):
        page_size = 50
        queryset = Catalog.objects.all()

        name = self.request.query_params.get('name', None)
        author = self.request.query_params.get('author', None)
        category_name = self.request.query_params.get('category', None)
        rating = self.request.query_params.get('rating', None)
        publication = self.request.query_params.get('publication', None)
        recentlyAdded = self.request.query_params.get('recentlyadded', None)

        if recentlyAdded:
            recentlyAdded = True
            user = self.request.user

            try:
                user = self.request.user
                queryset = Catalog.objects.raw('''select "bID" from (select distinct on (book."bID") book."bID", bc1.date_addition from auth_user au
                join backend_collection c1 on (c1."uID_id" = au.id)
                    join backend_collection_books bc1 on (c1."cID" = bc1."cID_id")
                    join backend_catalog book on (bc1."bID_id" = book."bID")
                    where (au.id = %s)
                    order by book."bID", bc1.date_addition desc) as foo
                    order by date_addition desc
                    limit %s''', [user.id, page_size])
                return queryset
            except:
                return Catalog.objects.none()

        else:
            recentlyAdded = False

        if name is not None:
            queryset = queryset.filter(name__icontains=name)

        if author is not None:
            queryset = queryset.filter(author__icontains=author)

        if category_name is not None:
            try:
                category_id = Category.objects.get(category__iexact=category_name).cID
                queryset = queryset.filter(categories__cID = category_id)
            except:
                # Invalid category should return nothing
                return Catalog.objects.none()

        if rating is not None:
            rating = int(rating)
            queryset = queryset.filter(rating__gte = rating)

        if publication is not None:
            try:
                lower = int(publication.split("-")[0])
                upper = int(publication.split("-")[1])
                queryset = queryset.filter(year__range = [lower,upper+1])
            except:
                pass

        # Sort by number of reviews, then rating
        queryset = queryset.order_by('-numReviews', '-rating', '-numCollections')
        queryset = queryset[:page_size]

        return queryset

class RatingLikeView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]


    serializer_class = BookSerializerId

    def get(self, request, *args, **kwargs):
        userId = int(request.user.id)
        reviewId = request.query_params.get("id")
        # Check rating ID given
        if not reviewId:
            return Response(
                data={
                    "message": "Review id must be presented"
                },
                status=status.HTTP_200_OK
            )
        reviewId = int(reviewId)
        # Check rating ID coressponds with an object
        try:
            reviewObject = Review.objects.get(rId = reviewId)
        except:
            return Response(
                data={
                    "message": "Not a valid review ID"
                },
                status=status.HTTP_200_OK
            )

        # Check if the user has already liked the book
        try:
            review_like = ReviewLikes.objects.get(user = userId, review = reviewId)
            #review_like.delete()
            return Response(
                data={
                    "status": "already liked"
                },
                status=status.HTTP_200_OK
            )
        except:
            pass


        # Like the book
        new = ReviewLikes(review = reviewObject, user = request.user)
        new.save()

        # Increment the review like counter
        reviewObject.likesno += 1
        reviewObject.save()

        return Response(
            data={
                "message": "liked"
            },
            status=status.HTTP_201_CREATED
        )

class CollectionCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]

    serializer_class = BookSerializerId



    def get(self, request, *args, **kwargs):
        userId = int(request.user.id)
        collectionName = request.query_params.get("name")
        # Check name given
        if not collectionName:
            return Response(
                data={
                    "message": "failed"
                },
                status=status.HTTP_200_OK
            )
        # Make sure the name is not already in the users collection
        try:
            collectionObject = Collection.objects.get(uID = request.user, name = collectionName)
            return Response(
                data={
                    "message": "failed"
                },
                status=status.HTTP_200_OK
            )
        except:
            pass

        # Else add the collection to the database
        new = Collection(name = collectionName, uID = request.user)
        new.save()

        return Response(
            data={
                "message": "created"
            },
            status=status.HTTP_201_CREATED
        )

class CollectionUserDisplay(viewsets.ReadOnlyModelViewSet):
    #permission_classes = [IsAuthenticated]
    permission_classes = (permissions.AllowAny,)

    serializer_class = CollectionSerializer

    queryset = Collection.objects.none()

    def get_queryset(self):
        #return Collection.objects.none()
        currentUser = self.request.user

        # The target user is the current user by default
        targetUser = self.request.user

        targetUsername = self.request.query_params.get("username")

        # If username defined, make that the taget unless it is invalid
        if targetUsername:
            try:
                targetUser = User.objects.get(username = targetUsername)
            except:
                # If the target user is invalid, return the current user
                pass

        try:
            collections = Collection.objects.all().filter(uID = targetUser)
        except:
            collections = Collection.objects.none()

        return collections

class CollectionBookDisplay(viewsets.ReadOnlyModelViewSet):
    #permission_classes = [IsAuthenticated]
    permission_classes = (permissions.AllowAny,)

    serializer_class = CollectionBookSerializer

    queryset = Collection.objects.none()

    def get_queryset(self):

        collectionID = self.request.query_params.get("cid")

        books = Catalog.objects.none()

        try:
            collection = Collection.objects.get(cID = collectionID)
            books = collection.books
        except:
            pass

        return books

class CollectionAddBookView(generics.CreateAPIView):
    # User can only add to their collection
    permission_classes = [IsAuthenticated]

    serializer_class = BookSerializerId

    def get(self, request, *args, **kwargs):
        collectionID = request.query_params.get("cid")
        bookID = request.query_params.get("bid")

        userId = int(request.user.id)
        currentUser = request.user





        try:
            collectionID = int(collectionID)
            bookID = int(bookID)
            collectionObject = Collection.objects.get(uID = request.user, cID = collectionID)
            bookObject = Catalog.objects.get(bID = bookID)

            # Check that the object does not already exist
            if not Collection_Books.objects.filter(bID = bookObject, cID = collectionObject).exists():
                # Make the object for the addition
                new = Collection_Books(bID = bookObject, cID = collectionObject)
                new.save()
                # Also save the book
                bookObject.save()
                return Response(
                    data={
                        "message": "success"
                    },
                    status=status.HTTP_200_OK
                )

        except:
            pass

        return Response(
            data={
                "message": "failed"
            },
            status=status.HTTP_201_CREATED
        )

class BookView(generics.CreateAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = BookSerializerId
    def get(self, request, *args, **kwargs):
        bookid = request.query_params.get("id")
        if not bookid:
            return Response(
                data={
                    "message": "Bookid must be presented"
                },
                status=status.HTTP_200_OK
            )
        try:
            bookset = Catalog.objects.get(bID = bookid)
        except:
            return Response(
                data={
                    "message": "Book does not exist"
                },
                status=status.HTTP_200_OK
            )
        try:
            reviews = Review.objects.filter(bID = bookset.bID)
            criticno = 0
            commno = 0
            for r in reviews:
                if r.critic == 1:
                    criticno += 1
                else:
                    commno += 1
        except:
            criticno = 0
            commno = 0
        try:
            reviews = Collection_Books.objects.filter(bID = bookset.bID)
            collectionno = 0
            for r in reviews:
                collectionno += 1
        except:
            collectionno = 0
        data = {'id': bookset.bID, 'name': bookset.name,'author': bookset.author,'categories': bookset.get_categories(),'description': bookset.description,'image_url': bookset.image,\
            'publication': int(float(bookset.year)),
            #'critic_rating': bookset.critic_rating,
            'critic_rating': bookset.get_critic_rating(),

            #'comm_rating': bookset.user_rating,
            'comm_rating': bookset.get_user_rating(),
            'no_critic': criticno,
            'no_comm': commno,
            'collections': collectionno}
        return Response(
            data=data,
            status=status.HTTP_201_CREATED
        )

class RatingView(generics.CreateAPIView):
    permission_classes = (permissions.AllowAny,)

    serializer_class = ReviewSerializer
    def get(self, request, *args, **kwargs):
        bookid = request.query_params.get("id")
        no_page = request.query_params.get("no")
        no_page = int(no_page)
        sort_definition = request.query_params.get("filter")
        if sort_definition == 'likes':
            sort_definition = '-likesno'
        if sort_definition == 'date':
            sort_definition = '-year'
        rating_page = 10
        if not bookid:
            return Response(
                data={
                    "message": "Bookid must be presented"
                },
                status=status.HTTP_200_OK
            )
        reviewset = Review.objects.filter(bID = bookid).order_by(sort_definition)[rating_page*(no_page-1):rating_page*(no_page)]
        if not reviewset:
            return Response(
                data={'no_pages':0,'reviews':[]},
                status=status.HTTP_201_CREATED
            )
        tarray = []
        for r in reviewset:
            user = r.uID
            tdata = {'likes': r.likesno,\
                'reviewer': user.username,\
                'text': r.review,\
                'critic': True if r.critic == 1 else False,\
                'score': r.rating,\
                'id': r.rId}
            tarray.append(tdata)
        length = math.ceil(len(Review.objects.filter(bID = bookid))/rating_page)
        data = {'no_pages':length,'reviews':tarray}
        return Response(
            data=data,
            status=status.HTTP_201_CREATED
        )
class RatingAddView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    def post(self,request, *args, **kwargs):
        rating = request.data.get("rating", "")
        review = request.data.get("review", "")
        bid = request.data.get("id","")
        token = request.META.get("Authorization")
        if (id == '') and (rating == ''):
            return Response(
                data={
                    "stat": "id, rating and review must be presented"
                },
                status=status.HTTP_200_OK
            )
        if (review == ''):
            return Response(
                data={
                    "stat": "please provide review"
                },
                status=status.HTTP_200_OK
            )
        c = Catalog.objects.get(bID = bid)
        if not c:
            return Response(
                data={ "stat": "book doesn't exist"},
                status=status.HTTP_200_OK
            )
        userId = int(request.user.id)
        u = request.user
        try:
            cr = UserCritic.objects.get(uID = u)
        except:
            cr = UserCritic(uID = u,critic = '0')
            cr.save()
        if cr.critic == 'false':
            cr.critic = '0'
            cr.save()
        if cr.critic == 'true':
            cr.critic = '1'
            cr.save()
        if not u:
            return Response(
                data={ "stat": "User doesn't exist"},
                status=status.HTTP_200_OK
            )
        try:
            Review.objects.get(uID = u,bID = c)
            return Response(
                data={ "stat": "User already has review"},
                status=status.HTTP_200_OK
            )
        except:
            p = Review(bID = c,uID = u,rating = int(rating),critic = int(cr.critic),review = review,likesno = 0)
            p.save()
            # Also save the book
            c.save()
        return Response(
            data={"stat": "success"},
            status=status.HTTP_201_CREATED
        )


class RegisterUsers(generics.CreateAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserSerializer
    def post(self, request, *args, **kwargs):
        username = request.data.get("username", "")
        password = request.data.get("password", "")
        if not username and not password:
            return Response(
                data={
                    "message": "username, password and email is required to register a user"
                },
                status=status.HTTP_200_OK
            )
        if not self.password_checker(password):
             return Response(
                data={
                    "message": "valid password is required to register a user"
                },
                status=status.HTTP_200_OK
            )
        if User.objects.filter(username=username).exists():
            return Response(
                data={
                    "message": "Username already exists"
                },
                status=status.HTTP_200_OK
            )
        new_user = User.objects.create_user(
            username=username, password=password,email="")
        c = UserCritic(uID = new_user,critic = '0')
        c.save()
        #token, _ = Token.objects.get_or_create(user=new_user)
        return Response(
            data={'token':''},
            status=status.HTTP_201_CREATED
        )

    def password_checker(self,passwd):
        SpecialSym =['!','$', '@', '#', '%']
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

class LogoutUsers(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    def get(self, request, *args, **kwargs):
        token = request.META.get("Authorization")
        try:
            request.user.auth_token.delete()
            logout(request)
        except (AttributeError, ObjectDoesNotExist):
            pass


        return Response({"success": ("Successfully logged out.")},
                    status=status.HTTP_200_OK)

class BookRecommendationView(generics.CreateAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = BookSerializerId
    def get(self, request, *args, **kwargs):
        bookid = request.query_params.get("bid")
        if not bookid:
            return Response(
                data={
                    "message": "Bookid must be presented"
                },
                status=status.HTTP_200_OK
            )
        try:
            book = Catalog.objects.get(bID = bookid)
        except:
            return Response(
                data={
                    "message": "Book does not exist"
                },
                status=status.HTTP_200_OK
            )


        modes = []

        # If there are other books for this authur, append this mode
        # Sort by rating, and then numCollections
        authorMode = Catalog.objects.filter(author__icontains=book.author).exclude(bID = bookid)
        if authorMode:
            # Exclude this book
            authorMode = authorMode.order_by('-rating', '-numCollections')[:5]
            authorMode = BookRecommendSerializer(authorMode, many=True).data
            modes.append({'mode': "Other Great Books by This Author", 'books': authorMode})

        # Gather all of the books in collections that contain this book
        # Sort by number of collections then rating
        collectionMode = authorMode = Catalog.objects.raw('''select c2."bID", count(c2."bID") from backend_catalog c1
            join backend_collection_books bc1 on (c1."bID" = bc1."bID_id")
            join backend_collection_books bc2 on (bc1."cID_id" = bc2."cID_id")
            join backend_catalog c2 on (c2."bID" = bc2."bID_id")
            where (c1."bID" = %s and c2."bID" != %s)
            group by c2."bID", c2.rating
            order by count(c2."bID") desc, c2.rating desc
            limit 5''', [bookid, bookid])
        if collectionMode:
            collectionMode = BookRecommendSerializer(collectionMode, many=True).data
            modes.append({'mode': "Collections Containing This Book Also Often Contain", 'books': collectionMode})


        # Sort by the books with the most number of common categories
        # Then sort by rating
        mostCategoriesMode = authorMode = Catalog.objects.raw('''select c2."bID", count(c2."bID") from backend_catalog c1
            join backend_category_catalogs cc1 on (c1."bID" = cc1.catalog_id)
            join backend_category_catalogs cc2 on (cc1.category_id = cc2.category_id)
            join backend_catalog c2 on (c2."bID" = cc2.catalog_id)
            where (c1."bID" = %s and c2."bID" != %s)
            group by c2."bID", c2.rating
            order by count(c2."bID") desc, c2.rating desc
            limit 5''', [bookid, bookid])
        if mostCategoriesMode:
            mostCategoriesMode = BookRecommendSerializer(mostCategoriesMode, many=True).data
            modes.append({'mode': "Books With Similar Categories", 'books': mostCategoriesMode})

        # Niche Category mode
        # Select the category that is the rarest for the book and find other books with that category
        # Sort by rating and then number of collections
        try:
            niche = book.categories.order_by('numBooks')[0]
            nicheCategoryMode = Catalog.objects.filter(categories__cID=niche.cID).exclude(bID = bookid)
            if nicheCategoryMode:
                # Exclude this book
                nicheCategoryMode = nicheCategoryMode.order_by('-rating', '-numCollections')[:5]
                nicheCategoryMode = BookRecommendSerializer(nicheCategoryMode, many=True).data
                modes.append({'mode': "Other Great Books With Category \'"+niche.category+"\'", 'books': nicheCategoryMode})
        except:
            pass
        data = {'recs': modes}
        return Response(
            data=data,
            status=status.HTTP_201_CREATED
        )
class RecommendationupdateView(generics.CreateAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = BookSerializerId
    def post(self, request, *args, **kwargs):
        if True:
            print('Starting Model Update')
            rset = Review.objects.all().order_by('uID__id')
            cset = Collection_Books.objects.order_by('-date_addition')
            Users = [int(x.uID.id) for x in rset]
            Books = [int(x.bID.bID) for x in rset]
            Rating = [int(x.rating) for x in rset]
            Users.extend([int(x.cID.uID.id) for x in cset])
            Books.extend([int(x.bID.bID) for x in cset])
            Rating.extend([5 for x in cset])
            max_userid = max(Users)+1
            max_bookid = max(Books)+1
            k_factors = 50 # The number of dimensional embeddings for movies and users
            stats = pd.DataFrame.from_dict({'uid':[max_userid],'bid':[max_bookid],'K_FACTORS':k_factors})
            stats.to_csv('stats.csv',index=False)
            x_input = Input(shape=(1,))
            y_input = Input(shape=(1,))
            x = Embedding(max_userid, k_factors, input_length=1)(x_input)
            x = Reshape((k_factors,))(x)
            y = Embedding(max_bookid, k_factors, input_length=1)(y_input)
            y = Reshape((k_factors,))(y)
            c = concatenate([x,y])
            o= Dense(1,activation='relu')(c)
            model = Model(inputs=[x_input, y_input], outputs=o)
            print(model.summary())
                # Compile the model using MSE as the loss function and the AdaMax learning algorithm
            model.compile(loss='mse', optimizer='adamax')
            callbacks = [EarlyStopping('val_loss', patience=2),
            ModelCheckpoint('models/weights.h5', save_best_only=True)]
            # Use 30 epochs, 90% training data, 10% validation data
            cfmodel = model.fit([np.array(Users), np.array(Books)], np.array(Rating), epochs=50, validation_split=.1, verbose=0, callbacks=callbacks)
        return Response(
                data={'message':'Updated'},
                status=status.HTTP_201_CREATED
            )
class RecommendationView(generics.CreateAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = BookSerializerId
    def post(self, request, *args, **kwargs):
        stats = pd.read_csv('stats.csv')
        if request.user.is_authenticated:
            c_uid = int(request.user.id)
            if stats.loc[0,'uid'] > c_uid:
                modes = []
                u = request.user
                max_userid = stats.loc[0,'uid']
                max_bookid = stats.loc[0,'bid']
                k_factors = stats.loc[0,'K_FACTORS']
                x_input = Input(shape=(1,))
                y_input = Input(shape=(1,))
                x = Embedding(max_userid, k_factors, input_length=1)(x_input)
                x = Reshape((k_factors,))(x)
                y = Embedding(max_bookid, k_factors, input_length=1)(y_input)
                y = Reshape((k_factors,))(y)
                c = concatenate([x,y])
                o= Dense(1,activation='relu')(c)
                model = Model(inputs=[x_input, y_input], outputs=o)
                # Load weights
                model.load_weights('models/weights.h5')
                def predict_rating(user_id, item_id):
                    return model.predict([np.array([user_id]), np.array([item_id])])[0][0]
                predict = pd.DataFrame.from_records(Catalog.objects.filter(bID__lt =int(max_bookid)).values('bID','name','image'))
                predict.columns = ['bID','name','image_url']
                predict['uID'] = c_uid
                predict = predict[predict['bID'] < int(max_bookid)]
                predict['prediction'] = model.predict([np.array(predict['uID']), np.array(predict['bID'])])
                #predict['prediction'] = predict.apply(lambda x: predict_rating(c_uid, x['bID']), axis=1)
                predict = predict.sort_values(by='prediction',ascending=False)
                file = predict[['bID','name','image_url']]
                file.columns = ['bid','name','image_url']
                dummy = {'mode':'Top Recommended Books','books':json.loads(file.iloc[0:20].to_json(orient='records'))}
                modes.append(dummy)
                cate = pd.DataFrame.from_records(Category.objects.all().values('category','catalogs'))
                cate.columns = ['category','bID']
                df = predict.merge(cate,on = 'bID')
                file = df[df['category'] == 'Fantasy']
                file = file[['bID','name','image_url']]
                file.columns = ['bid','name','image_url']
                dummy = {'mode':'Recommended Fantasy Books','books':json.loads(file.iloc[0:20].to_json(orient='records'))}
                modes.append(dummy)
                file = df[df['category'] == 'Mystery']
                file = file[['bID','name','image_url']]
                file.columns = ['bid','name','image_url']
                dummy = {'mode':'Recommended Mystery Books','books':json.loads(file.iloc[0:20].to_json(orient='records'))}
                modes.append(dummy)
                file = df[df['category'] == 'Adventure']
                file = file[['bID','name','image_url']]
                file.columns = ['bid','name','image_url']
                dummy = {'mode':'Recommended Adventure Books','books':json.loads(file.iloc[0:20].to_json(orient='records'))}
                modes.append(dummy)
                file = df[df['category'] == 'Historical']
                file = file[['bID','name','image_url']]
                file.columns = ['bid','name','image_url']
                dummy = {'mode':'Recommended Historical Books','books':json.loads(file.iloc[0:20].to_json(orient='records'))}
                modes.append(dummy)
                data = {'recs':modes}
                return Response(
                data=data,
                status=status.HTTP_201_CREATED
                )
        modes = []
        higly = Catalog.objects.all().order_by('-critic_rating')[0:20]
        mostCategoriesMode = BookRecommendSerializer(higly, many=True).data
        modes.append({'mode': "Books With High Critic Rating", 'books': mostCategoriesMode})
        higly = Catalog.objects.all().order_by('-user_rating')[0:20]
        mostCategoriesMode = BookRecommendSerializer(higly, many=True).data
        modes.append({'mode': "Books With High User Rating", 'books': mostCategoriesMode})
        higly = Catalog.objects.all().order_by('-numReviews')[0:20]
        mostCategoriesMode = BookRecommendSerializer(higly, many=True).data
        modes.append({'mode': "Books With Most Reviews", 'books': mostCategoriesMode})
        higly = Catalog.objects.all().order_by("-year")[0:20]
        mostCategoriesMode = BookRecommendSerializer(higly, many=True).data
        modes.append({'mode': "Latest Additions ", 'books': mostCategoriesMode})
        collectionMode = Catalog.objects.all().order_by('-numCollections')[0:20]
        mostCategoriesMode = BookRecommendSerializer(collectionMode, many=True).data
        modes.append({'mode': "Top Books in Collections", 'books': mostCategoriesMode})
        data = {'recs':modes}
        return Response(
            data=data,
            status=status.HTTP_201_CREATED
        )

class ReminderCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]

    serializer_class = BookSerializerId



    def get(self, request, *args, **kwargs):
        userId = int(request.user.id)

        reminderText = request.query_params.get("text")
        if not reminderText:
            reminderText = ""

        reminderName = request.query_params.get("name")
        # Check name given
        if not reminderName:
            return Response(
                data={
                    "message": "failed"
                },
                status=status.HTTP_200_OK
            )
        # Make sure the name is not already in the users reminders
        try:
            reminderObject = Reminder.objects.get(uID = request.user, name = reminderName)
            return Response(
                data={
                    "message": "failed"
                },
                status=status.HTTP_200_OK
            )
        except:
            pass

        # Else add the reminder to the database
        new = Reminder(name = reminderName, uID = request.user, text = reminderText)
        new.save()

        return Response(
            data={
                "message": "created"
            },
            status=status.HTTP_201_CREATED
        )

class ReminderUserDisplay(generics.CreateAPIView):
    #permission_classes = [IsAuthenticated]
    permission_classes = (permissions.AllowAny,)

    serializer_class = ReminderSerializer

    queryset = Reminder.objects.none()

    def get(self, request, *args, **kwargs):
        currentUser = request.user

        # The target user is the current user by default
        targetUser = request.user

        targetUsername = request.query_params.get("username")

        # If username defined, make that the taget unless it is invalid
        if targetUsername:
            try:
                targetUser = User.objects.get(username = targetUsername)
            except:
                # If the target user is invalid, return the current user
                pass

        try:
            reminders = Reminder.objects.all().filter(uID = targetUser)
        except:
            reminders = Reminder.objects.none()

        entries = []
        for reminder in reminders:
            entry = {}
            entry["name"] = reminder.get_name()
            entry["description"] = reminder.get_description()
            entry["is_challenge"] = reminder.get_is_challenge()

            challenge = {}
            if reminder.isChallenge == 1:
                challenge["cid"] = reminder.get_collection()
                challenge["description"] = reminder.challenge.get_description(reminder.uID)
                challenge["days_remaining"] = reminder.challenge.get_days_remaining()
                challenge["progress"] = reminder.challenge.get_progress()
                challenge["progress_percent"] = float(reminder.challenge.get_progress_percent())
                challenge["days_percent"] = float(reminder.challenge.get_days_percent())

            entry["challenge"] = challenge
            entries.append(entry)

        #reminders = ReminderSerializer(reminders, many=True).data
        return Response(
            data=entries,
            status=status.HTTP_201_CREATED
        )
        return reminders

class ChallengeView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = BookSerializerId
    def get(self, request, *args, **kwargs):
        try:
            source = self.request.user
            books = request.query_params.get("books")
            books = int(books)

            reminderName = request.query_params.get("name")
            dest = request.query_params.get("user")
            dest = User.objects.get(username = dest)
            # Make sure there is no challenge for these users in the system
            # Note: the next iteration we can perform a check to only include active challenges
            print("here")
            if not Challenge.objects.filter(source = source, dest = dest):
                # Create the collection
                collection = Collection(name = source.username + "\'s Challenge to " + dest.username, uID = dest)
                collection.save()

                # Create the challenge
                challenge = Challenge(source = source, dest = dest, collection = collection, books = books)
                challenge.save()

                # Create the reminders for each user
                new = Reminder(name = source.username + "->" + dest.username, uID = source, text = "", isChallenge = True, challenge = challenge)
                new.save()
                new = Reminder(name = source.username + "->" + dest.username, uID = dest, text = "", isChallenge = True, challenge = challenge)
                new.save()

                return Response(
                    data={
                        "stat": "created"
                    },
                    status=status.HTTP_201_CREATED
                )
            return Response(
                data={
                    "stat": "exists"
                },
                status=status.HTTP_200_OK
            )
        except:
            return Response(
                data={
                    "stat": "failed"
                },
                status=status.HTTP_200_OK
            )
class ProfileView(generics.CreateAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = BookSerializerId
    def get(self, request, *args, **kwargs):
        try:
            username = request.query_params.get("username")
            user = User.objects.get(username = username)

            return Response(
                data={
                    "stat": "success",
                    "no_collections": len([i for i in list(user.collections.all())]),
                    "no_challenges": len([i for i in list(Challenge.objects.filter(dest = user))])
                },
                status=status.HTTP_201_CREATED
            )
        except:
            return Response(
                data={
                    "stat": "fail"
                },
                status=status.HTTP_201_CREATED
            )
