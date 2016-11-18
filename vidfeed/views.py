from django.http import HttpResponse
from django.template import loader
from django.views.decorators.csrf import ensure_csrf_cookie
from django.shortcuts import render


@ensure_csrf_cookie
def index(request):
    return render(request, 'index.html', {})


def robots(request):
    template = loader.get_template('robots.txt')
    return HttpResponse(template.render({}), content_type='text/plain; charset=utf8')
