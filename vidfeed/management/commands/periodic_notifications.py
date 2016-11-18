from __future__ import absolute_import

from django.core.management.base import BaseCommand
import datetime
from django.utils import timezone

from vidfeed.feed.models import Feed
from vidfeed.utils import send_email

class Command(BaseCommand):
    """
    """
    args = ''
    help = 'Send periodic notifications'

    def handle(self, *args, **options):
        feeds = Feed.objects.filter(comment__has_notified=False).distinct()
        for feed in feeds:
            user_latest_comment = feed.comment_set.filter(has_notified=False)\
                .order_by('owner', '-created').distinct('owner')
            for c in user_latest_comment:
                if c.created < timezone.now() - datetime.timedelta(minutes=30):
                    collaborators = feed.feedcollaborator_set.all()
                    comments_to_notify = feed.comment_set.filter(owner=c.owner,
                                                                 has_notified=False)
                    for collaborator in collaborators:
                        if c.owner != collaborator.user:
                            ctx = {
                                'commenter': c.owner,
                                'comments': comments_to_notify,
                                'feed': c.feed,
                            }
                            send_email('regular_update', ctx, 'Comments on Feed', collaborator.user.email)
                    comments_to_notify.update(has_notified=True)
