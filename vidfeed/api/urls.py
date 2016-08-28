from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns
from vidfeed.api import views

urlpatterns = [
    url(r'^feeds/(?P<feed_id>\S+)/comments$', views.CommentList.as_view()),
    url(r'^comments/$', views.CommentList.as_view()),
    url(r'^feeds/$', views.FeedList.as_view()),
    url(r'^feeds/(?P<feed_id>\S+)/$', views.FeedDetail.as_view()),

]

urlpatterns = format_suffix_patterns(urlpatterns)
