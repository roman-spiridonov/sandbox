from django.contrib.auth.models import User
from django.views.generic import CreateView
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm


class SignUpView(CreateView):
    template_name = 'signup.html'
    form_class = UserCreationForm
    success_url = '/'


