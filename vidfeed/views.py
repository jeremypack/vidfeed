from django.http import HttpResponse
from django.template import loader
from django.views.decorators.csrf import ensure_csrf_cookie
from django.shortcuts import render


@ensure_csrf_cookie
def index(request):
    return render(request, 'index.html', {})


@ensure_csrf_cookie
def password_reset(request, uidb64, token):
    ops = {
        'token': token,
        'uidb64': uidb64,
    }
    return render(request, 'reset_password.html', ops)


@ensure_csrf_cookie
def api_test(request):
    return render(request, 'api_test.html', {})


@ensure_csrf_cookie
def api_account_test(request):
    return render(request, 'api_account_test.html', {})


def robots(request):
    template = loader.get_template('robots.txt')
    return HttpResponse(template.render({}), content_type='text/plain; charset=utf8')
