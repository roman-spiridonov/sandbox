from django.shortcuts import render
from django.shortcuts import HttpResponse  # status code 200


def show_views(request, id=0):  # ViewClass -> .as_view() method creates similar function
    print(request.method)
    print(request.GET)
    # resp = HttpResponse('Hello world, id: {}, name: {}'.format(news_id, request.GET.get('name')))
    # resp['Age'] = 20
    # # resp['Content-Disposition'] = 'attachment; filename="file.txt"'
    # return resp
    return render(request, "hello.html", {'id': id, 'name': request.GET.get('name')})