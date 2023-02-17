from django.db import models
from django.contrib.auth.models import User
from decimal import Decimal
from django.utils import timezone

# Create your models here.
class Catalog(models.Model):
    bID = models.AutoField(primary_key=True)
    author = models.TextField()
    image = models.TextField()
    image_url = models.TextField(default='invalid_url')
    name = models.TextField()
    year = models.TextField()
    description = models.TextField()

    #Ratings (To be modified when review is added)
    rating = models.DecimalField(max_digits=2, decimal_places=1, default=Decimal(0.0)) # Probably just average of user and critic rating
    user_rating = models.DecimalField(max_digits=2, decimal_places=1, default=Decimal(0.00))
    critic_rating = models.DecimalField(max_digits=2, decimal_places=1, default=Decimal(0.00))

    # Collections
    numCollections = models.IntegerField(default=0)
    numReviews = models.IntegerField(default=0)
    class Meta:
        ordering = ['author','name']

    def get_categories(self):
        return [i.category for i in list(self.categories.all())]
    def get_number_collections(self):
        return len([i for i in list(self.collections.all())])
    def get_author(self):
        return author
    def get_image(self):
        return image
    def get_image_url(self):
        return image_url
    def get_name(self):
        return name
    def get_year(self):
        return year
    def get_description(self):
        return description
    def get_user_rating(self):
        ratings =  [int(i.rating) for i in list(self.reviews.filter(critic = 0))]
        if len(ratings) == 0:
            return "{:.1f}".format(round(0,2))
        else:
            return "{:.1f}".format(round(sum(ratings)/len(ratings),2))
    def get_critic_rating(self):
        ratings =  [int(i.rating) for i in list(self.reviews.filter(critic = 1))]
        if len(ratings) == 0:
            return "{:.1f}".format(round(0,2))
        else:
            return "{:.1f}".format(round(sum(ratings)/len(ratings),2))

    def get_rating(self):
        critic = self.get_critic_rating()
        user = self.get_user_rating()
        if (critic == '0.0'):
            return user
        if (user == '0.0'):
            return critic
        else:
            return "{:.1f}".format(round((float(user)+float(critic))/2,2))

    # Rather then going through all of the views and making sure
    # These are updated appropiately, every save updates these
    def save(self, *args, **kwargs):
        self.user_rating = self.get_user_rating()
        self.critic_rating = self.get_critic_rating()
        self.rating = self.get_rating()
        self.numCollections = self.get_number_collections()
        self.numReviews = len([i for i in list(self.reviews.all())])
        super(Catalog, self).save(*args, **kwargs)





class Category(models.Model):
    cID = models.AutoField(primary_key=True)
    catalogs = models.ManyToManyField(Catalog, related_name = "categories")
    category = models.TextField()
    numBooks = models.IntegerField(default=0)

    def save(self, *args, **kwargs):
        self.numBooks = len([i for i in Catalog.objects.filter(categories__cID=self.cID)])
        super(Category, self).save(*args, **kwargs)


class Review(models.Model):
    rId = models.AutoField(primary_key=True)
    #bID = models.IntegerField()
    bID = models.ForeignKey(
        Catalog,
        default=0,
        on_delete=models.CASCADE,
        related_name='reviews',
        db_column='bID',
        )
    uID = models.ForeignKey(User,
        on_delete=models.CASCADE)
    rating = models.TextField()
    critic = models.IntegerField()
    review = models.TextField()
    likesno = models.IntegerField(default = 0)
    likes = models.ManyToManyField(User, related_name = "review_likes",
        through = "ReviewLikes")
    year = models.DateTimeField(default=timezone.now)

class ReviewLikes(models.Model):
    class Meta:
        # https://docs.djangoproject.com/en/3.0/ref/models/options/#unique-together
        unique_together = (('user', 'review'),)
    user = models.ForeignKey(User,
        on_delete=models.CASCADE)
    review = models.ForeignKey(Review,
        on_delete=models.CASCADE)


class UserCritic(models.Model):
    uID = models.OneToOneField(User, on_delete=models.CASCADE,primary_key=True)
    avatar = models.TextField(default = '')
    critic = models.TextField()

class User_History(models.Model):
    bID = models.IntegerField()
    uID = models.IntegerField()
    date = models.DateField()

class Collection(models.Model):
    uID = models.ForeignKey(
        User,
        default=0,
        on_delete=models.CASCADE,
        related_name='collections',
        )
    cID = models.AutoField(primary_key=True)
    name = models.TextField()
    Tags = models.TextField(default = "")
    books = models.ManyToManyField(Catalog, related_name = "collections",
        through = "Collection_Books")

    def books_count(self):
        return len([i for i in list(self.books.all())])

class Collection_Books(models.Model):
    bID = models.ForeignKey(
        Catalog,
        default=0,
        on_delete=models.CASCADE,
        )
    cID = models.ForeignKey(
        Collection,
        default=0,
        on_delete=models.CASCADE,
        )
    date_addition = models.DateTimeField(default=timezone.now)

def thirty_days():
    return timezone.now() + timezone.timedelta(days=30)

class Challenge(models.Model):
    id = models.AutoField(primary_key=True)
    source = models.ForeignKey(
        User,
        default=0,
        on_delete=models.CASCADE,
        related_name='remindersSent',
        )
    dest = models.ForeignKey(
        User,
        default=0,
        on_delete=models.CASCADE,
        related_name='remindersRecieved',
        )
    start = models.DateTimeField(default=timezone.now)
    end = models.DateTimeField(default=thirty_days)

    collection = models.ForeignKey(
        Collection,
        default=0,
        on_delete=models.CASCADE,
        related_name='challenges',
        )
    books = models.IntegerField(default = 0)


    def is_active(self):
        return True

    def get_description(self, uID):

        if self.source == uID:
            source =  "you"
            dest = self.dest.username
        else:
            source =  self.source.username
            dest = "you"

        desc = "On " + str(self.start.date()) +", " + source + " sent a " + str(self.books) + " book challenge to " + dest
        desc +=": 'Read this many books in 30 days'"

        return desc

    def get_days_remaining(self):
        return str(int((self.end - timezone.now()).days)+1)

    def get_progress(self):
        return str(self.collection.books_count()) +" out of " + str(self.books)
    def get_progress_percent(self):
        return str(round(int(self.collection.books_count())*100/self.books, 1))
    def get_days_percent(self):
        return str(round((1 - int(self.get_days_remaining())/30)*100, 1))

class Reminder(models.Model):
    uID = models.ForeignKey(
        User,
        default=0,
        on_delete=models.CASCADE,
        related_name='reminders',
        )
    rID = models.AutoField(primary_key=True)
    name = models.TextField()
    text = models.TextField()
    isChallenge = models.IntegerField(default = 0)
    challenge = models.ForeignKey(
        Challenge,
        default=None,
        on_delete=models.CASCADE,
        related_name='reminders',
        blank=True,
        null=True,
        )

    def get_is_challenge(self):
        if self.isChallenge == 1:
            return "true"
        else:
            return "false"
    def get_collection(self):
        if self.isChallenge != 1:
            return 0
        else:
            return self.challenge.collection.cID

    def get_name(self):
        name = ""
        if self.isChallenge == 1:
            challenge = self.challenge
            if challenge.is_active:
                name += "Active: "
            else:
                name += "Inactive: "
            if challenge.source == self.uID:
                name += "You Challenged " + challenge.dest.username + "!"
            else:
                name += challenge.source.username + " Challenged You!"
        else:
            name = self.name
        return name

    def get_description(self):

        if self.isChallenge != 1:
            print(self.text)
            return self.text
        else:
            return "Challenge"
