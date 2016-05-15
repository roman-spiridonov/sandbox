from django.conf.urls import url
import news.views

urlpatterns = [
     url(r'^$', news.views.NewsListView.as_view(), name="news_list"),
     url(r'^create/$', news.views.ArticleCreate.as_view(), name="news_create"),
     url(r'^hello/(?P<news_id>\d+)/$', news.views.show_views),  # http://127.0.0.1:8000/news/hello/1/?name=petr
     url(r'^(?P<pk>\d+)/$', news.views.NewsView.as_view(), name="news_detail"),  # pk - db id of model
]