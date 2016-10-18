from __future__ import unicode_literals

from django.db import models
from django.conf import settings

import re
import random
import string


class Provider(models.Model):
    name = models.CharField(max_length=100, blank=False, null=False)
    link_format = models.CharField(max_length=200, blank=False, null=False)

    def __unicode__(self):
        return self.name

    @staticmethod
    def find_valid_provider(link):
        link = link.strip()
        for expression in ProviderExpression.objects.filter(active=True):
            match = re.search(expression.discover_expression, link)
            if match:
                video_id = match.group('video_id')
                return expression.provider, video_id, False
        return None, None, None


"""
If an expression matches it needs to return a video_id group that can be used.
E.g. basic one for youtube would be:
www.youtube.com/watch\?v=(?P<video_id>\S+)
"""
class ProviderExpression(models.Model):
    provider = models.ForeignKey(Provider)
    discover_expression = models.CharField(max_length=1000, blank=False, null=False)
    active = models.BooleanField(default=True, null=False, blank=True)
    prompt_for_password = models.BooleanField(default=False)

    def __unicode__(self):
        return self.discover_expression


class Feed(models.Model):
    LINK_ID_LENGTH = 9

    created = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True)
    feed_id = models.CharField(max_length=100)
    provider = models.ForeignKey(Provider)
    video_id = models.CharField(max_length=100, blank=False, null=False)
    password = models.CharField(max_length=100, default='')
    active = models.BooleanField(blank=True, null=False, default=True)
    video_title = models.CharField(max_length=250, default='')
    video_thumbnail = models.CharField(max_length=500, default='')

    def get_full_name(self):
        if self.owner:
            return self.owner.get_display_name()
        return 'orphaned'

    def invite_user(self, recipient, sender):
        if FeedInvites.objects.filter(feed=self, recipient=recipient).count() > 0:
            return

        invitee = FeedInvites(feed=self,
                              recipient=recipient,
                              sender=sender)
        invitee.clean_fields()
        invitee.save()

    @staticmethod
    def generate_link_id():
        return ''.join(
            random.SystemRandom().choice(string.ascii_uppercase + string.ascii_lowercase + string.digits) for _ in
            range(Feed.LINK_ID_LENGTH))

    def __unicode__(self):
        return u'Provider: {0}, Video ID: {1}, Feed ID: {2}'.format(self.provider.name, self.video_id, self.feed_id)


class FeedInvites(models.Model):
    feed = models.ForeignKey(Feed)
    recipient = models.EmailField(max_length=254)
    sender = models.ForeignKey(settings.AUTH_USER_MODEL)
    created = models.DateTimeField(auto_now_add=True)
    accepted = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ('created', )


class Comment(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    feed = models.ForeignKey(Feed)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL)
    body = models.TextField()
    timecode = models.FloatField(default=0)
    deleted = models.BooleanField(default=False)
    parent_comment = models.ForeignKey('Comment', null=True, blank=True)
    has_notified = models.BooleanField(default=False)

    @property
    def parent_id(self):
        if self.parent_comment:
            return self.parent_comment.id
        return None

    @property
    def children(self):
        return Comment.objects.filter(parent_comment=self,
                                      deleted=False).order_by('created')
