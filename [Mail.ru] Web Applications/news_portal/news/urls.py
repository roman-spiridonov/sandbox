from django.conf.urls import url
import news.views

urlpatterns = [
     url(r'^$', news.views.NewsListView.as_view(), name="list"),
     url(r'^create/$', news.views.ArticleCreate.as_view(), name="create"),
     url(r'^(?P<pk>\d+)/$', news.views.NewsDetail.as_view(), name="detail"),  # pk - db id of model
]