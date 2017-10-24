import os
from django.http import HttpResponse
from django.template import loader
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import ensure_csrf_cookie
from django.shortcuts import render, redirect
from django.conf import settings
from profiles.models import Subscription
from feed.models import Feed
from utils import get_vimeo_title_and_thumbnail_with_subscription

import vimeo
from oauth2client import client


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
def authorize_youtube(request):
    if not request.user.get_subscription():
        return HttpResponse('Unauthorized', status=401)
    flow = client.flow_from_clientsecrets(
        settings.GOOGLE_OAUTH2_CLIENT_SECRETS_JSON,
        scope='https://www.googleapis.com/auth/youtube.readonly',
        redirect_uri=settings.BASE_URL + '/auth/youtube/success')
    flow.params['access_type'] = 'offline'
    flow.params['include_granted_scopes'] = 'true'
    auth_uri = flow.step1_get_authorize_url()
    return redirect(auth_uri)


@login_required
def authorize_youtube_success(request):
    subscription = Subscription.objects.get(user=request.user)
    if not subscription:
        return HttpResponse('Unauthorized', status=401)

    if not request.GET.get('error'):
        flow = client.flow_from_clientsecrets(
            settings.GOOGLE_OAUTH2_CLIENT_SECRETS_JSON,
            scope='https://www.googleapis.com/auth/youtube.readonly',
            redirect_uri=settings.BASE_URL + '/auth/youtube/success')
        flow.params['access_type'] = 'offline'
        flow.params['include_granted_scopes'] = 'true'
        auth_code = request.GET.get('code')
        credentials = flow.step2_exchange(auth_code)
        subscription.youtube_credentials = credentials
        subscription.save()
    return redirect('/app/dashboard')


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

        # try and populate feed titles and images
        feeds_without_titles = Feed.objects.filter(owner=request.user, provider__name='vimeo', video_thumbnail='')
        for feed in feeds_without_titles:
            title, image = get_vimeo_title_and_thumbnail_with_subscription(feed.video_id, subscription)
            if title:
                feed.video_title = title
                feed.video_thumbnail = image
                feed.save()

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


@ensure_csrf_cookie
def youtube_test(request):
    return render(request, 'test_pages/youtube_test.html', {})


def robots(request):
    template = loader.get_template('robots.txt')
    return HttpResponse(template.render({}), content_type='text/plain; charset=utf8')
