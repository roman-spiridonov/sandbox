from django.db import models


class Comment(models.Model):
    article = models.ForeignKey('news.Article', related_name="comments")
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)