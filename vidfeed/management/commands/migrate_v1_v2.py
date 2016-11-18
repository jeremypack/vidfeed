from __future__ import absolute_import

from django.core.management.base import BaseCommand

from django.db import connections

from vidfeed.profiles.models import SiteUser
from vidfeed.feed.models import Provider, Feed, Comment, FeedInvite


class Command(BaseCommand):
    """
    """
    args = ''
    help = 'Migrate database from vidfeed v1 to v2'

    def handle(self, *args, **options):

        user_map = dict()

        ORIG_VIMEO = 1
        ORIG_YOUTUBE = 2
        provider_map = dict()
        feed_map = dict()
        comment_map = dict()

        provider_youtube = Provider.objects.get(name='youtube')
        provider_vimeo = Provider.objects.get(name='vimeo')
        provider_map[ORIG_VIMEO] = provider_vimeo
        provider_map[ORIG_YOUTUBE] = provider_youtube

        cursor = connections['from_db'].cursor()
        try:
            cursor.execute("SELECT * FROM profile_vidfeeduser")
            previous_users = cursor.fetchall()
            for u in previous_users:
                prev_id = u[0]
                prev_password = u[1]
                prev_last_login = u[2]
                prev_is_su = u[3]
                prev_email = u[4]
                prev_first_name = u[5]
                prev_last_name = u[6]
                prev_date_joined = u[7]
                prev_is_active = u[8]
                prev_is_staff = u[8]
                new_user = SiteUser.objects.create(
                                password=prev_password,
                                last_login=prev_last_login,
                                is_superuser=prev_is_su,
                                email=prev_email,
                                first_name=prev_first_name if prev_first_name else "",
                                last_name=prev_last_name if prev_last_name else "",
                                is_staff=prev_is_staff,
                                is_active=prev_is_active,
                                date_joined=prev_date_joined)
                user_map[prev_id] = new_user
        finally:
            cursor.close()

        cursor = connections['from_db'].cursor()
        try:
            cursor.execute("SELECT * FROM vidfeed_vidfeed")
            vidfeeds = cursor.fetchall()
            for vidfeed in vidfeeds:
                f_id = vidfeed[0]
                feed_created = vidfeed[1]
                feed_id = vidfeed[2]
                active = vidfeed[3]
                owner_id = vidfeed[4]
                provider_id = vidfeed[5]
                video_id = vidfeed[6]
                password = vidfeed[7]
                video_thumbnail = vidfeed[8]
                video_title = vidfeed[9]

                new_feed = Feed.objects.create(
                                        created=feed_created,
                                        owner=user_map.get(owner_id),
                                        feed_id=feed_id,
                                        provider=provider_map[provider_id],
                                        video_id=video_id,
                                        password=password,
                                        active=active,
                                        video_title=video_title,
                                        video_thumbnail=video_thumbnail,)

                feed_map[f_id] = new_feed

        finally:
            cursor.close()

        cursor = connections['from_db'].cursor()
        try:
            cursor.execute("SELECT * FROM vidfeed_vidfeedcomment ORDER BY id")
            comments = cursor.fetchall()
            for comment in comments:
                comment_id = comment[0]
                body = comment[1]
                feed_id = comment[2]
                owner_id = comment[3]
                timestamp = comment[4]
                created = comment[5]
                deleted = comment[6]
                parent_comment_id = comment[7]

                new_comment = Comment.objects.create(
                    created=created,
                    owner=user_map[owner_id],
                    feed=feed_map[feed_id],
                    body=body,
                    timecode=timestamp,
                    deleted=deleted,
                    parent_comment=comment_map.get(parent_comment_id),
                    has_notified=True,)

                comment_map[comment_id] = new_comment

                # add a collaborator
                feed_map[feed_id].add_collaborator(user_map[owner_id])

        finally:
            cursor.close()

        cursor = connections['from_db'].cursor()
        try:
            cursor.execute("SELECT * FROM vidfeed_vidfeedinvites ORDER BY id")
            invites = cursor.fetchall()
            for invite in invites:
                recipient_user = SiteUser.objects.find_or_create_user(invite[1])
                sender_user = SiteUser.objects.find_or_create_user(invite[2])
                feed_id = invite[5]
                FeedInvite.objects.create(
                    feed=feed_map[feed_id],
                    recipient=recipient_user,
                    sender=sender_user,)
                feed_map[feed_id].add_collaborator(recipient_user)
        finally:
            cursor.close()
