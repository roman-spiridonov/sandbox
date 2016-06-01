from django.views.generic import DetailView, ListView, CreateView, UpdateView, FormView
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.http import Http404, HttpResponseRedirect # status code 302
from .models import Article, Like
from .forms import ArticleListForm#, ArticleCreateForm
from comments.forms import CommentForm
from django.core.urlresolvers import reverse
from django.shortcuts import resolve_url  # for redirecting to URL from router by name
from django.db import models
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.core.exceptions import PermissionDenied

class ArticleCreate(CreateView):
    model = Article
    # form_class = ArticleCreateForm  # needs to be inherited from ModelForm
    template_name = 'news/create.html'
    fields = ('title', 'text', 'tags', 'is_published')

    def form_valid(self, form):  # additional assignments before saving submitted form results to cleaned_data
        # instance = form.save(commit=False)
        # instance.author = self.request.user  # hidden on server-side
        form.instance.author = self.request.user  # hidden on server-side
        return super().form_valid(form)

    # @method_decorator(login_required)
    # def dispatch(self, request, *args, **kwargs):  # processing any request
    #     self.form = ArticleCreateForm(request.POST or None)
    #     if self.form.is_valid() :
    #         return super().dispatch(request, *args, **kwargs)
    #     return super().get(request, *args, **kwargs)

    # def get_context_data(self, **kwargs):  # preparing context for template rendering
    #     context = super().get_context_data(**kwargs)
    #     context['form'] = self.form  # redefining CreateView's form to our custom form
    #     return context

    # def get_success_url(self):  # where to redirect user after successful object creation
    #     return resolve_url('news:detail', pk=self.object.pk)  # works similar to {% url }


class ArticleUpdate(UpdateView):
    model = Article
    template_name = 'news/create.html'
    fields = ('title', 'text', 'tags', 'is_published')

    # @method_decorator(login_required)
    # def dispatch(self, request, *args, **kwargs):  # processing any request
    #     if Article.objects.get(pk=kwargs['pk']).author != request.user:
    #         # TODO: is there easier way to get updated Article object?
    #         raise PermissionDenied
    #     return super().dispatch(request, *args, **kwargs)

    def get_queryset(self):
        return Article.objects.filter(author=self.request.user)

# Short form: generic view
# TemplateVIew class: render with context
# DetailView class: take object ID from URL, fetch object by ID from db, render using template
class NewsDetail(DetailView):
    model = Article
    template_name = 'news/article.html'

    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        self.comment_form = CommentForm(request.POST or None) # create filled (POST) or empty form (initial GET)
        if request.method == 'POST' and self.comment_form.is_valid():
            self.comment_form.instance.article_id = self.get_object().id
            self.comment_form.save(commit=True)
            return HttpResponseRedirect(reverse('news:detail', args=[self.get_object().pk,]))

        return super().dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['comment_form'] = self.comment_form
        return context

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
        # # Search and sort are get request parameters
        # self.search = request.GET.get('search')
        # self.sort_field = request.GET.get('sort_field')

        self.invites_received = request.user.invitations_received.all()

        # Django Forms - built-in validation
        self.form = ArticleListForm(request.GET)  # search, sort_field - GET parameters
        if self.form.is_valid():
            return super().dispatch(request, *args, **kwargs)
        return super().get(request, *args, **kwargs)

    def get_queryset(self):  # fetching all objects, because this is list view
        queryset = Article.objects.all()
        queryset = queryset.authored_by(self.request.user)

        # if self.search:
            # queryset = queryset.filter(title__icontains=self.search)
        if self.form.cleaned_data.get('search'):
            queryset = queryset.filter(title__icontains=self.form.cleaned_data['search'])
        # if self.sort_field:
            # queryset = queryset.order_by(self.sort_field)
        if self.form.cleaned_data.get('sort_field'):
            queryset = queryset.order_by(self.form.cleaned_data['sort_field'])

        queryset = queryset.annotate(comments_count=models.Count('comment_set__id'))

        return queryset#[:10]  # can redefine for sorting, filtering, etc.       #TODO: add pagination


    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['form'] = self.form
        context['invites_received'] = self.invites_received
        return context

# # Same as function
# from django.shortcuts import render
# def news_list(request):
#     form = ArticleListForm(request.GET)
#     if form.is_valid():
#         # form.save()
#         return render(request, 'list.html', {'object_list': Article.objects.all(),
#                                              'form':form})


def apply_like(request, pk):
    try:
        a = Article.objects.get(pk=pk)
    except Article.DoesNotExist:
        raise Http404("Fatal: article with pk {} does not exist".format(pk))

    try:
        u = User.objects.get(pk=request.user.id)
    except User.DoesNotExist:
        raise Http404("Fatal: user with pk {} does not exist".format(request.user.id))

    likes = a.toggle_like(u, commit=True)
    # return HttpResponseRedirect(reverse('news:list'))
    return JsonResponse({"pk": a.pk, "likes": likes})
