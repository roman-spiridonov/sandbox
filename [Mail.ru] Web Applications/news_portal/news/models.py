# conding: utf-8

from django.db import models
from django.conf import settings

class Article(models.Model):

    author = models.ForeignKey(settings.AUTH_USER_MODEL)
    title = models.CharField(max_length=255)
    text = models.TextField()
    pub_date = models.DateField(auto_now_add=True)
    rating = models.IntegerField(default=0)

    def __str__(self):
        return ' '.join(['id:', str(self.id), 'pk:', str(self.pk), 'title:', self.title])

    class Meta:  # meta-model
        verbose_name = 'Статья'
        verbose_name_plural = 'Статьи'
        ordering = ('title', )  # default sorting of objects of this model; specify "-" for reverse sort


class ArticleLike(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL)
    article = models.ForeignKey('Article', related_name="like_set")
    is_liked = models.BooleanField(default=False)

    def __str__(self):
        return ' '.join(['id:', str(self.id), 'user:', self.user.username, 'is_liked:', '1' if self.is_liked else '0'])
