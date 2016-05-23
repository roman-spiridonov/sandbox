"""jirautils URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin
from django.contrib.auth.views import login, logout
from techsupport.views import TechsupportView


urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^hello/', include('hello.urls')),
    url(r'^(news/)?', include('news.urls', namespace='news')),
    url(r'^login/', login, {'template_name': 'login.html'}, name="login"),  # redirect after login in settings.py
    url(r'^logout/', logout, {'next_page': 'news:list'}, name="logout"),
    url(r'^techsupport/$', TechsupportView.as_view(), name="techsupport"),
]