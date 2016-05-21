from django.views.generic import DetailView, ListView, CreateView
# from django.shortcuts import HttpResponseRedirect  # status code 302
# from django.http import HttpResponseRedirect
from .models import Article
from .forms import ArticleListForm, ArticleForm
from django.shortcuts import resolve_url  # for redirecting to URL from router by name


class ArticleCreate(CreateView):
    model = Article
    template_name = 'news/create.html'
    fields = ('title', 'text')

    def form_valid(self, form):
        form.instance.author = self.request.user
        return super(ArticleCreate, self).form_valid(form)

    def get_success_url(self):  # where to redirect user after successful object creation
        return resolve_url('news_detail', pk=self.object.pk)  # works similar to {% url }

    def dispatch(self, request, *args, **kwargs):
        self.aform = ArticleForm(request.POST or None)
        return super(ArticleCreate, self).dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super(ArticleCreate, self).get_context_data(**kwargs)
        context['aform'] = self.aform
        return context


# Short form: generic view
# TemplateVIew class: render with context
# DetailView class: take object ID from URL, fetch object by ID from db, render using template
class NewsDetail(DetailView):
    model = Article
    template_name = 'news/article.html'
    # context_object_name = 'object'  # implicit - see article.html
    # # View class: use get, post functions
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

    def dispatch(self, request, *args, **kwargs):
        # Django Forms - built-in validation
        self.form = ArticleListForm(request.GET)
        self.form.is_valid()

        # # Pass search and sort as get request parameters
        # self.search = request.GET.get('search')
        # self.sort_field = request.GET.get('sort_field')
        return super(NewsListView, self).dispatch(request, *args, **kwargs)

    def get_queryset(self):  # fetching all objects, because this is list view
        queryset = Article.objects.filter(author=self.request.user)
        # if self.search:
            # queryset = queryset.filter(title__icontains=self.search)
        if self.form.cleaned_data.get('search'):
            queryset = queryset.filter(title__icontains=self.form.cleaned_data['search'])
        # if self.sort_field:
            # queryset = queryset.order_by(self.sort_field)
        if self.form.cleaned_data.get('sort_field'):
            queryset = queryset.order_by(self.form.cleaned_data['sort_field'])

        return queryset[:10]  # can redefine for sorting, filtering, etc.

    def get_context_data(self, **kwargs):
        context = super(NewsListView, self).get_context_data(**kwargs)
        context['form'] = self.form
        return context