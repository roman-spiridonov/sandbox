from django.conf.urls import url
import news.views

urlpatterns = [
     url(r'^$', news.views.NewsListView.as_view(), name="news_list"),
     url(r'^create/$', news.views.ArticleCreate.as_view(), name="news_create"),
     url(r'^(?P<pk>\d+)/$', news.views.NewsDetail.as_view(), name="news_detail"),  # pk - db id of model
]