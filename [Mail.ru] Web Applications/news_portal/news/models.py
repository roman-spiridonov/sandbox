# conding: utf-8

from django.db import models
from django.conf import settings
from django.db.models import Q
from django.core.urlresolvers import reverse


# class ArticleManager(models.Manager):
#     def authored_by(self, user):
#         if user.is_authenticated():
#             return super().get_queryset().filter(
#                 Q(author=user) | Q(is_published=True))
#         else:
#             return super().get_queryset().filter(is_published=True)
class ArticleQuerySet(models.QuerySet):
    def authored_by(self, user):
        if user.is_authenticated():
            return self.filter(Q(author=user) | Q(is_published=True))
        else:
            return self.filter(is_published=True)


class Article(models.Model):

    author = models.ForeignKey(settings.AUTH_USER_MODEL)
    title = models.CharField(max_length=255)
    text = models.TextField()
    pub_date = models.DateTimeField(auto_now_add=True)
    rating = models.IntegerField(default=0)
    is_published = models.BooleanField(default=False)
    # TODO: add labels using chosen.js and generic foreign keys (content_types)

    def __str__(self):
        return ' '.join(['id:', str(self.id), 'pk:', str(self.pk), 'title:', self.title])

    class Meta:  # meta-model
        verbose_name = 'Статья'
        verbose_name_plural = 'Статьи'
        ordering = ('title', )  # default sorting of objects of this model; specify "-" for reverse sort

    objects = ArticleQuerySet.as_manager()  # retrieve ModelManager to objects; usage: article.objects
    # objects = ArticleManager

    def get_absolute_url(self):  # used by django to get url to model instance; can use: redirect(article)
        return reverse("news:detail", args=[self.id])

    def get_latest_comment(self):
        return self.comment_set.latest()  # uses get_latest_by Meta field


class ArticleLike(models.Model):  # inside Article: likes = models.ManyToManyField(settings.AUTH_USER_MODEL)
    user = models.ForeignKey(settings.AUTH_USER_MODEL)
    article = models.ForeignKey('Article', related_name="like_set")
    is_liked = models.BooleanField(default=False)

    def __str__(self):
        return ' '.join(['id:', str(self.id), 'user:', self.user.username, 'is_liked:', '1' if self.is_liked else '0'])

    class Meta:  # meta-model
        verbose_name = 'Лайк'
        verbose_name_plural = 'Лайки'
