import json
import requests
from django.conf import settings
from django.core.mail import EmailMessage, EmailMultiAlternatives
from django.template import TemplateDoesNotExist
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.template.loader import render_to_string
import datetime


def send_email(template, template_context, subject, to, from_email=None):
    base_template_context = {
        'settings': {
            'BASE_URL': settings.BASE_URL,
            'STATIC_URL': '/static/',
            'LOGO_SMALL': 'email-logo-262x80.png',
        }
    }
    template_context.update(base_template_context)
    html_template_name = 'emails/{0}.html'.format(template)
    text_template_name = 'emails/{0}.txt'.format(template)
    try:
        html = render_to_string(html_template_name, template_context)
    except TemplateDoesNotExist:
        html = None
    try:
        text = render_to_string(text_template_name, template_context)
    except TemplateDoesNotExist:
        text = None

#   Toggle Email by removing #
#    html = None
    if html is not None and text is not None:
        email = EmailMultiAlternatives(subject, text, from_email=from_email, to=[to])
        email.attach_alternative(html, "text/html")
        email.send()
    elif html is not None:
        email = EmailMessage(subject=subject,
                             body=html,
                             from_email=from_email,
                             to=[to])
        email.content_subtype = "html"
        email.send()
    else:
        email = EmailMessage(subject=subject,
                             body=text,
                             from_email=from_email,
                             to=[to])
        email.send()


def set_vidfeed_user_cookie(response, email):
    set_cookie(response, 'vidfeeduser', email, days_expire=365)


def set_cookie(response, key, value, days_expire=7):
    if days_expire is None:
        max_age = 365 * 24 * 60 * 60
    else:
        max_age = days_expire * 24 * 60 * 60
    expires = datetime.datetime.strftime(datetime.datetime.utcnow() + datetime.timedelta(seconds=max_age),
                                         "%a, %d-%b-%Y %H:%M:%S GMT")
    response.set_cookie(key, value, max_age=max_age, expires=expires, domain=settings.COOKIE_DOMAIN,
                        secure=None)


def check_email(email):
    try:
        validate_email(email)
        return True
    except ValidationError:
        return False


def get_vimeo_title_and_thumbnail(video_id):
    url = 'https://vimeo.com/api/v2/video/' + video_id + '.json'
    try:
        r = requests.get(url)
        if r.status_code == 200:
            result = r.json()
            return result[0].get('title'), result[0].get('thumbnail_large')
    except:
        pass
    return "", ""


def get_youtube_title_and_thumbnail(video_id):
    payload = {'id': video_id, 'key': settings.YOUTUBE_API_KEY, 'part': 'snippet'}
    try:
        r = requests.get('https://www.googleapis.com/youtube/v3/videos', params=payload)
        if r.status_code == 200:
            result = r.json()
            snippet = result.get('items')[0].get('snippet')
            thumbnail = snippet.get('thumbnails').get('maxres')
            if not thumbnail:
                thumbnail = snippet.get('thumbnails').get('medium')
            if not thumbnail:
                thumbnail = snippet.get('thumbnails').get('default')
            thumb = thumbnail.get('url')
            title = snippet.get('title')
            return title, thumb
    except:
        pass
    return "", ""