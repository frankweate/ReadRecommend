"""server URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
#Rest import
from django.urls import include
from rest_framework import routers
from backend.views import *
from backend.views import  RegisterUsers, LogoutUsers, RatingView, BookView
urlpatterns = [
    path('admin/', admin.site.urls),
]

#Rest API
# define the router
router = routers.DefaultRouter()
router.register(r'user', UserViewSet)
#router.register(r'book', BookViewSet)
#router.register(r'search', SearchView.as_view())
router.register(r'search',SearchView)
router.register(r'collection/all',CollectionUserDisplay)
router.register(r'collection/book', CollectionBookDisplay)

#router.register(r'collection/add', CollectionAddBookView, name="collection-add-book)

# define the router path and viewset to be used
#router.register(r'login/', LoginViewSet)

from rest_framework.authtoken import views
#router.register(r'geeks', views.obtain_auth_token, basename='Login')
urlpatterns += [
    path('login/', views.obtain_auth_token)
]

urlpatterns += [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
    path('auth/register/', RegisterUsers.as_view(), name="auth-register"),
    path('auth/logout/', LogoutUsers.as_view(), name="auth-logout"),
    path('rating/', RatingView.as_view(), name="rating"),
    path('book/', BookView.as_view(), name="book"),
    path('like/rating/', RatingLikeView.as_view(), name="review-like"),
    path('rating/submit/', RatingAddView.as_view(), name="rating-add"),
    path('collection/create/', CollectionCreateView.as_view(), name="collection-create"),
    path('collection/add/', CollectionAddBookView.as_view(), name="collection-add-book"),
    path('reminder/create/', ReminderCreateView.as_view(), name="reminder-create"),
    path('reminder/all/',ReminderUserDisplay.as_view(),name="reminder-display"),
    path('recommendation/book/', BookRecommendationView.as_view(), name="book-recommendation"),
    path('recommendation/base/', RecommendationView.as_view(), name="homepage-recommendation"),
    path('recommendation/update/', RecommendationupdateView.as_view(), name="update-recommendation"),
    path('challenge/submit/', ChallengeView.as_view(), name="challenge-add"),
    path('profile/', ProfileView.as_view(), name="profile-view"),
]
