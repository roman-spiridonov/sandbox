from django.shortcuts import render
from django.shortcuts import HttpResponse  # status code 200

def show_views(request, news_id=0):
    print(request.method)
    print(request.GET)
    # resp = HttpResponse('Hello world, id: {}, name: {}'.format(news_id, request.GET.get('name')))
    # resp['Age'] = 20
    # # resp['Content-Disposition'] = 'attachment; filename="file.txt"'
    # return resp
    return render(request, "hello.html", {'id': news_id, 'name': request.GET.get('name')})


from django.views.generic import DetailView
# from django.shortcuts import HttpResponseRedirect  # status code 302
# from django.http import HttpResponseRedirect
from .models import Article

# TemplateVIew class: render with context

# DetailView class: take object ID from URL, fetch object by ID from db, render using template
class NewsView(DetailView):
    model = Article
    template_name = 'article_upd.html'
    # context_object_name = 'object'  # implicit - see article.html
    # # View class: use get, post functions
    # def get(self):
    #     return HttpResponseRedirect("/")

