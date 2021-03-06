from django.conf.urls import url, include
from django.contrib import admin
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.conf import settings
from vidfeed import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^reset/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$', views.password_reset,
        name='password_reset_confirm'),
    url(r'^auth/vimeo$', views.authorize_vimeo, name='authorize_vimeo'),
    url(r'^auth/vimeo/success$', views.authorize_vimeo_success, name='authorize_vimeo_success'),
    url(r'^auth/youtube$', views.authorize_youtube, name='authorize_youtube'),
    url(r'^auth/youtube/success$', views.authorize_youtube_success, name='authorize_youtube_success'),
    url(r'^api-test$', views.api_test, name='api_test'),
    url(r'^api-account-test$', views.api_account_test, name='api_account_test'),
    url(r'^vimeo-test$', views.vimeo_test, name='vimeo_test'),
    url(r'^youtube-test$', views.youtube_test, name='youtube_test'),
    url(r'^robots\.txt$', views.robots),
    url(r'^app/', views.index),
    # url(r'^api/auth/', include('rest_auth.urls')),
    url(r'^api/api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^api/', include('vidfeed.api.urls')),
    url(r'^admin/', admin.site.urls),
]


if settings.DEBUG:
    urlpatterns += staticfiles_urlpatterns()
