from django.contrib import admin
from news.models import Article
from comments.models import Comment

class CommentInLine(admin.TabularInline):  # editting connected models: can be also StackedInline etc.
    model = Comment
    extra = 2  # provide fields for 3 comments (2 extra)

class ArticleAdmin(admin.ModelAdmin):  # customize admin UI for creating new article
    fieldsets = [
        (None, {'fields': ['author', 'title', 'text']}),
    ]
    inlines = [CommentInLine]
    list_display = ('pk', 'pub_date', 'title')
    list_filter = ['pub_date']
    search_fields = ['title', 'text']

admin.site.register(Article, ArticleAdmin)
