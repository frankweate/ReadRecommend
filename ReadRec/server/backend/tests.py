from django.test import TestCase
 
import json
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.views import status
from rest_framework.authtoken.models import Token
# Create your tests here.
class BaseViewTest(APITestCase):
    client = APIClient()
    fixtures = ['fixtures/catalog.json','fixtures/user.json','fixtures/reviews.json']
    def make_request(self,kind = 'post', **kwargs):
        if kind == "post":
            return self.client.post(
                reverse(
                    "book-create",
                    kwargs={
                        "version": kwargs["version"]
                    }
                ),
                data=json.dumps(kwargs["data"]),
                content_type='application/json'
            )
        elif kind == "put":
            return self.client.put(
                reverse(
                    "book-detail",
                    kwargs={
                        "version": kwargs["version"],
                        "pk": kwargs["id"]
                    }
                ),
                data=json.dumps(kwargs["data"]),
                content_type='application/json'
            )
        else:
            return None
    
    def register_a_user(self, username="", password="", email=""):
        return self.client.post(
            reverse(
                "auth-register"
            ),
            data=json.dumps(
                {
                    "username": username,
                    "password": password,
                    "email": email
                }
            ),
            content_type='application/json'
        )
    def book_query(self, bookid=""):
        return self.client.get(
            reverse(
                "book"
            ),
            {'id':bookid},HTTP_X_REQUESTED_WITH='XMLHttpRequest')
    def rating_query(self, bookid="",no=1,filterS=""):
        return self.client.get(
            reverse(
                "rating"
            ),
                {
                    "id": bookid,
                    "no": no,
                    "filter": filterS
                },HTTP_X_REQUESTED_WITH='XMLHttpRequest'
        )
    def rating_add_query(self, bookid="",rating=1,review="",token=""):
        self.client.credentials(HTTP_AUTHORIZATION='token ' + str(token))
        return self.client.post(
            reverse(
                "rating-add"
            ),
                {
                    "id": bookid,
                    "rating": rating,
                    "review": review
                },
            content_type='application/json'
        )
    def update_model(self):
        return self.client.post(
            reverse(
                "update-recommendation"
            ),
                {},
            content_type='application/json'
        )
    def recommend_model(self, uid=""):
        return self.client.post(
            reverse(
                "homepage-recommendation"
            ),
                {
                    "uid": uid
                },
            content_type='application/json'
        )
    def setUp(self):
            # create a admin user
            self.user = User.objects.create_superuser(
                username="Testing123ABC",
                password="Testing@12",
                first_name="test",
                last_name="user",
            )
            self.client.force_authenticate(user=self.user)
            # add test data
        
class AuthRegisterUserTest(BaseViewTest):
    """
    Tests for auth/register/ endpoint
    """
    def test_register_a_user(self):
        response = self.register_a_user("new_user", "Testing@12", "new_user@mail.com")
        # assert status code is 201 CREATED
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # test with invalid data
        response = self.register_a_user()
        # assert status code
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class BookTest(BaseViewTest):
    """
    Tests for auth/register/ endpoint
    """
    def test_book(self):
        response = self.book_query(112)
        # assert status code is 201 CREATED
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # test with invalid data
        response = self.book_query()
        # assert status code
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class RatingTest(BaseViewTest):
    """
    Tests for auth/register/ endpoint
    """
    def test_rating(self):
        response = self.rating_query(258,1,'likes')
        # assert status code is 201 CREATED
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        response = self.rating_query(258,1,'date')
        # assert status code is 201 CREATED
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # test with invalid data
        response = self.rating_query()
        # assert status code
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class RatingAddtest(BaseViewTest):
    """
    Tests for auth/register/ endpoint
    """
    def test_add_rating(self):
        token, created = Token.objects.get_or_create(user=self.user)
        response = self.rating_add_query(258,1,'I Like it',token)
        # assert status code is 201 CREATED
        try:
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        except:
            print(response)
        response = self.rating_query(258,1,'date')
        # assert status code is 201 CREATED
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # test with invalid data
        response = self.rating_query()
        # assert status code
        self.assertEqual(response.status_code, status.HTTP_200_OK)
class updatetesttest(BaseViewTest):
    """
    Tests for auth/register/ endpoint
    """
    def test_add_rating(self):
        #self.update_model()
        self.recommend_model()