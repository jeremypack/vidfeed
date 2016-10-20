from django.conf.urls import url, include
from django.contrib import admin
from vidfeed import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^app/', views.index),
    url(r'^api/auth/', include('rest_auth.urls')),
    url(r'^api/api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^api/', include('vidfeed.api.urls')),
    url(r'^admin/', admin.site.urls),
]
