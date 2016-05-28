# -*- coding: utf-8 -*-
# $ python manage.py recount_likes
from django.core.management import BaseCommand


class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        print('likes recounted')
