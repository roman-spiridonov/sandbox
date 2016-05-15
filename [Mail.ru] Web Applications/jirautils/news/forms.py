from django import forms


class ArticleListForm(forms.Form):
    search = forms.CharField(required=False)
    sort_field = forms.ChoiceField(choices=(('id','ID'),('pub_date','Дата'),('title','Название')),required=False)

    def clean_search(self):
        search = self.cleaned_data.get('search')
        # raise forms.ValidationError("Я не хочу искать и сортировать, уходи!")
        return search


class ArticleForm(forms.Form):
    title = forms.CharField(max_length=255)
    text = forms.CharField(widget=forms.Textarea)
