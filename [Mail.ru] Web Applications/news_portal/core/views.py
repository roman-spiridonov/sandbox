from django.contrib.auth.models import User
from django.views.generic import CreateView
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.core.urlresolvers import reverse_lazy


class SignUpView(CreateView):  # TODO: improve form templates
    template_name = 'signup.html'
    form_class = UserCreationForm
    success_url = reverse_lazy('news:list')


