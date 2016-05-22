from django import forms
from django.forms.widgets import Textarea


class ReportErrorForm(forms.Form):
    title = forms.CharField(max_length=100)
    report = forms.CharField(widget=Textarea)
