from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns
from vidfeed.api import views

urlpatterns = [
    url(r'^comments/$', views.CommentList.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
