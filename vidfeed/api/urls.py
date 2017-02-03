from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns
from vidfeed.api import views

urlpatterns = [
    url(r'^feeds/(?P<feed_id>\S+)/comments/(?P<comment_id>\S+)/set-done$', views.set_comment_done),
    url(r'^feeds/(?P<feed_id>\S+)/comments$', views.CommentList.as_view()),
    url(r'^feeds/(?P<feed_id>\S+)/comments/(?P<comment_id>\S+)$', views.CommentDetail.as_view()),
    url(r'^feeds/$', views.FeedList.as_view()),
    url(r'^feeds/(?P<feed_id>\S+)/set-owner/$', views.FeedDetail.as_view({'post': 'set_owner'})),
    url(r'^feeds/(?P<feed_id>\S+)/$', views.FeedDetail.as_view({'get': 'get'})),
    url(r'^feeds/(?P<feed_id>\S+)/invites$', views.FeedInviteList.as_view()),
    url(r'^feeds/(?P<feed_id>\S+)/collaborators$', views.FeedCollaboratorList.as_view()),
    url(r'^profile/register$', views.register),
]

urlpatterns = format_suffix_patterns(urlpatterns)
