# -*- coding: utf-8 -*-
# $ python manage.py recount_likes
from django.core.management import BaseCommand
from news.models import Article
from django.utils import timezone


class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        for a in Article.objects.all():
            is_edited = False
            likes = a.like_set.count()
            if not(a.pub_date):
                print("Article {}: pub_date was missing => set to {}".format("<"+str(a)+">", timezone.now()))
                a.pub_date = timezone.now()
                is_edited = True
            if a.rating != likes:
                print("Article {}: rating was {} => fixed to {}".format("<"+str(a)+">", a.rating, likes))
                a.rating = likes
                is_edited = True
            if is_edited:
                a.save()
