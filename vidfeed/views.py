from django.http import HttpResponse
from django.template import loader
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import ensure_csrf_cookie
from django.shortcuts import render, redirect
from django.conf import settings
from profiles.models import Subscription

import vimeo


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


@login_required
def authorize_vimeo(request):
    if not request.user.get_subscription():
        return HttpResponse('Unauthorized', status=401)
    v = vimeo.VimeoClient(
        key=settings.VIMEO_CLIENT_IDENTIFIED,
        secret=settings.VIMEO_CLIENT_SECRET)
    vimeo_authorization_url = v.auth_url(['public', 'private'],
                                         settings.BASE_URL + '/auth/vimeo/success', 'xyz')
    return redirect(vimeo_authorization_url)


@login_required
def authorize_vimeo_success(request):
    subscription = Subscription.objects.get(user=request.user)
    if not subscription:
        return HttpResponse('Unauthorized', status=401)

    if not request.GET.get('error') and request.GET.get('state') == 'xyz':
        v = vimeo.VimeoClient(
            key=settings.VIMEO_CLIENT_IDENTIFIED,
            secret=settings.VIMEO_CLIENT_SECRET)
        token, user, scope = v.exchange_code(request.GET.get('code'),
                                             settings.BASE_URL + '/auth/vimeo/success')
        subscription.vimeo_token = token
        subscription.vimeo_scope = scope
        subscription.save()
    return redirect('/app/dashboard')

    # # You should retrieve the "code" from the URL string Vimeo redirected to.  Here that's named CODE_FROM_URL
    # try:
    #     token, user, scope = v.exchange_code(CODE_FROM_URL, 'https://example.com')
    # except vimeo.auth.GrantFailed:
    #     # Handle the failure to get a token from the provided code and redirect.


@ensure_csrf_cookie
def api_test(request):
    return render(request, 'test_pages/api_test.html', {})


@ensure_csrf_cookie
def api_account_test(request):
    return render(request, 'test_pages/api_account_test.html', {})

@ensure_csrf_cookie
def vimeo_test(request):
    return render(request, 'test_pages/vimeo_test.html', {})


def robots(request):
    template = loader.get_template('robots.txt')
    return HttpResponse(template.render({}), content_type='text/plain; charset=utf8')
