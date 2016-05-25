from django.views.generic import DetailView, ListView, CreateView, UpdateView
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.http import Http404, HttpResponseRedirect # status code 302
from .models import Article
from .forms import ArticleListForm, ArticleCreateForm
from django.core.urlresolvers import reverse
from django.shortcuts import resolve_url  # for redirecting to URL from router by name
from django.db import models

class ArticleCreate(CreateView):
    model = Article
    template_name = 'news/create.html'
    fields = ('title', 'text')

    def form_valid(self, form):  # additional assignments before saving submitted form results to cleaned_data
        form.instance.author = self.request.user  # hidden on server-side
        return super().form_valid(form)

    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):  # processing any request
        self.aform = ArticleCreateForm(request.POST or None)  # create filled (POST) or empty form (initial GET)
        # self.aform.is_valid()
        return super().dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):  # preparing context for template rendering
        context = super().get_context_data(**kwargs)
        context['aform'] = self.aform
        return context

    def get_success_url(self):  # where to redirect user after successful object creation
        return resolve_url('news:detail', pk=self.object.pk)  # works similar to {% url }

# Short form: generic view
# TemplateVIew class: render with context
# DetailView class: take object ID from URL, fetch object by ID from db, render using template
class NewsDetail(DetailView):
    model = Article
    template_name = 'news/article.html'

    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    # context_object_name = 'object'  # implicit - see article.html
    # # View class: use get, post functions after dispatch()
    # def get(self):
    #     return HttpResponseRedirect("/")

# # Same as function
# from django.shortcuts import get_object_or_404, render
# def news_detail(request, news_id):
#     article = get_object_or_404(Article, pk=news_id)  # fetch from db
#     return render(request, 'article.html', {'object': article})


class NewsListView(ListView):
    model = Article
    template_name = 'news/list.html'

    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        # Django Forms - built-in validation
        self.form = ArticleListForm(request.GET)
        self.form.is_valid()

        # # Pass search and sort as get request parameters
        # self.search = request.GET.get('search')
        # self.sort_field = request.GET.get('sort_field')
        return super().dispatch(request, *args, **kwargs)

    def get_queryset(self):  # fetching all objects, because this is list view
        if self.request.user.is_authenticated():
            queryset = Article.objects.filter(author=self.request.user)
        else:
            return []
        # if self.search:
            # queryset = queryset.filter(title__icontains=self.search)
        if self.form.cleaned_data.get('search'):
            queryset = queryset.filter(title__icontains=self.form.cleaned_data['search'])
        # if self.sort_field:
            # queryset = queryset.order_by(self.sort_field)
        if self.form.cleaned_data.get('sort_field'):
            queryset = queryset.order_by(self.form.cleaned_data['sort_field'])

        queryset = queryset.annotate(comments_count=models.Count('comment_set__id'))

        return queryset#[:10]  # can redefine for sorting, filtering, etc.

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['form'] = self.form
        return context

def apply_like(request, pk):
    try:
        a = Article.objects.get(pk=pk)
    except Article.DoesNotExist:
        raise Http404("Article with pk {} does not exist".format(article_pk))

    a.rating += 1
    a.save()

    return HttpResponseRedirect(reverse('news:list'))