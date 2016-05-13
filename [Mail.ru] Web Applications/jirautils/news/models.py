from django.db import models

class Article(models.Model):
    title = models.CharField(max_length=255)
    text = models.TextField()
    pub_date = models.DateField(auto_now_add=True)

