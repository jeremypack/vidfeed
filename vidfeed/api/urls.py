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
    url(r'^projects/$', views.ProjectList.as_view()),
    url(r'^projects/(?P<project_id>\d+)$', views.ProjectDetail.as_view()),
    url(r'^projects/(?P<project_id>\d+)/feed/(?P<feed_id>\S+)$', views.ManageProjectFeeds.as_view()),
    url(r'^projects/(?P<project_id>\d+)/feeds$', views.ProjectFeedList.as_view()),
    url(r'^profile/register$', views.register),
    url(r'^profile/login$', views.LoginView.as_view(), name='rest_login'),
    url(r'^profile/logout$', views.LogoutView.as_view(), name='rest_logout'),
    url(r'^profile/is-authenticated$', views.IsAuthenticatedView.as_view(), name='is_authenticated'),
    url(r'^profile/password/reset$', views.PasswordResetView.as_view(), name='rest_password_reset'),
    url(r'^password/reset/confirm/$', views.PasswordResetConfirmView.as_view(), name='rest_password_reset_confirm'),
]

urlpatterns = format_suffix_patterns(urlpatterns)
