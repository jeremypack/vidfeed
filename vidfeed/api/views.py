from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.conf import settings
from django.contrib.auth import (
    login as django_login,
    logout as django_logout
)
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import generics
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import detail_route, api_view, permission_classes

from vidfeed.profiles.models import SiteUser, Subscription
from vidfeed.feed.models import Comment, Feed, Provider, FeedInvite, FeedCollaborator, Project
from vidfeed.utils import get_youtube_title_and_thumbnail, get_vimeo_title_and_thumbnail, \
    set_vidfeed_user_cookie, send_email, get_vimeo_title_and_thumbnail_with_subscription
from serializers import CommentSerializer, FeedSerializer, FeedInviteSerializer, \
    FeedCollaboratorSerializer, UserSerializer, SiteUserSerializer, CommentDoneSerializer, \
    ProjectSerializer, LoginSerializer, PasswordResetSerializer, PasswordResetConfirmSerializer, \
    FeedUpdateSerializer

import json
import vimeo
import httplib2
from googleapiclient.discovery import build
from oauth2client.client import HttpAccessTokenRefreshError

import logging
logger = logging.getLogger('django.request')


class CommentList(APIView):
    def get_objects(self, feed_id):
        feed = get_object_or_404(Feed, feed_id=feed_id)
        return Comment.objects.filter(feed=feed, deleted=False,
                                      parent_comment__isnull=True)

    def get(self, request, feed_id, format=None):
        serializer = CommentSerializer(self.get_objects(feed_id), many=True)
        return Response(serializer.data)

    def post(self, request, feed_id, format=None):
        feed = get_object_or_404(Feed, feed_id=feed_id)
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            if serializer.validated_data.get('parent_id'):
                parent_comment = Comment.objects.get(pk=serializer.validated_data.get('parent_id'))
                if parent_comment.done:
                    return Response({"message": "Comment locked"},
                                    status=status.HTTP_400_BAD_REQUEST)
            try:
                comment = serializer.save(feed=feed)
            except Comment.DoesNotExist:
                return Response({"message": "Invalid parent comment"},
                                status=status.HTTP_400_BAD_REQUEST)
            owner_email = comment.owner.email
            feed.add_collaborator(comment.owner)
            r = Response(serializer.data, status=status.HTTP_201_CREATED)
            set_vidfeed_user_cookie(r, owner_email)

            # if this is a reply send an email to the comment owner
            if comment.parent_comment:
                # find all people in the thread
                all_replies = Comment.objects.filter(feed=comment.feed,
                                                     parent_comment=comment.parent_comment)
                reply_list = [comment.parent_comment.owner]
                for c in all_replies:
                    reply_list.append(c.owner)

                # remove duplicates
                reply_list = list(set(reply_list))
                ctx = {
                    'feed': feed,
                    'comment_author': owner_email,
                    'message': comment.body,
                }
                # send to everyone in the list
                for u in reply_list:
                    # actually skip the person who created the comment
                    if u != comment.owner:
                        send_email('new_reply', ctx,
                                   owner_email + " replied to your comment on "+feed.get_video_title(), u.email)
            # else send first comment email if first comment from this user
            else:
                user_comments = Comment.objects.filter(feed=feed,
                                                       owner__email=owner_email)
                if user_comments.count() == 1 and \
                        owner_email.strip().lower() != feed.owner.email.strip().lower():
                    ctx = {
                        'feed': feed,
                        'comment_author': owner_email,
                        'message' : comment.body,
                        'too_email' : feed.owner.email,
                    }
                    send_email('new_comment', ctx, owner_email + " just left their first comment on "+feed.get_video_title(), feed.owner.email)

            return r
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CommentDetail(APIView):
    def get_object(self, feed_id, pk):
        return get_object_or_404(Comment, feed__feed_id=feed_id, pk=pk)

    def put(self, request, feed_id, comment_id, format=None):
        comment = self.get_object(feed_id, comment_id)
        if comment.done:
            return Response({"message": "Comment locked"},
                            status=status.HTTP_400_BAD_REQUEST)
        serializer = CommentSerializer(comment, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, feed_id, comment_id, format=None):
        comment = self.get_object(feed_id, comment_id)
        if comment.done:
            return Response({"message": "Comment locked"},
                            status=status.HTTP_400_BAD_REQUEST)
        comment.deleted = True
        comment.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
def set_comment_done(request, feed_id, comment_id):
    comment_done = CommentDoneSerializer(data=request.data)
    if comment_done.is_valid():
        comment = get_object_or_404(Comment, feed__feed_id=feed_id, pk=comment_id)
        comment.done = comment_done.data.get('done')
        comment.save()
        return Response(CommentSerializer(comment).data, status=status.HTTP_200_OK)
    return Response(comment_done._errors, status=status.HTTP_400_BAD_REQUEST)


class FeedList(APIView):
    def get(self, request, format=None):
        if not request.user.is_authenticated():
            return Response({'message': 'You must login to see your feeds'},
                            status=status.HTTP_401_UNAUTHORIZED)
        feeds = Feed.objects.filter(owner=request.user, active=True).all()
        serializer = FeedSerializer(feeds, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        feedUrl = request.POST.get('videoUrl')
        if not feedUrl:
            return Response({"message": "Please enter a valid Url"}, status=status.HTTP_400_BAD_REQUEST)
        provider, video_id, has_password = Provider.find_valid_provider(feedUrl)
        if not provider:
            return Response({"message": "Please enter a valid Url"}, status=status.HTTP_400_BAD_REQUEST)
        title, thumb = '', ''
        if provider.name == 'youtube':
            title, thumb = get_youtube_title_and_thumbnail(video_id)
        elif provider.name == 'vimeo':
            title, thumb = get_vimeo_title_and_thumbnail(video_id)
            if not title and request.user.is_authenticated() and \
                    request.user.get_subscription():
                title, thumb = get_vimeo_title_and_thumbnail_with_subscription(
                    video_id, request.user.get_subscription())

        if not title and request.user.is_authenticated():
            title = 'Feed ' + str(Feed.objects.filter(owner=request.user).count() + 1)

        feed = Feed.objects.create(feed_id=Feed.generate_link_id(),
                                   provider=provider,
                                   video_id=video_id,
                                   active=True,
                                   video_title=title,
                                   video_thumbnail=thumb)
        return Response(FeedSerializer(instance=feed).data)


class FeedDetail(viewsets.GenericViewSet):
    def get_object(self, feed_id):
        return get_object_or_404(Feed, feed_id=feed_id)

    def get(self, request, feed_id, format=None):
        feed = self.get_object(feed_id)
        serializer = FeedSerializer(feed)
        return Response(serializer.data)

    def delete(self, request, feed_id, format=None):
        feed = self.get_object(feed_id)
        feed.active = False
        feed.save()
        return Response({"message": "Feed deleted"}, status=status.HTTP_200_OK)

    @detail_route(methods=['post'])
    def set_owner(self, request, feed_id):
        feed = self.get_object(feed_id)
        owner = request.POST.get('owner')
        if feed.owner is not None:
            return Response({"message": "Cannot overwrite owner"}, status=status.HTTP_403_FORBIDDEN)
        if not owner:
            return Response({"message": "Please enter a valid email"}, status=status.HTTP_400_BAD_REQUEST)
        feed.owner = SiteUser.objects.find_or_create_user(owner)
        feed.save()
        feed.add_collaborator(feed.owner)
        r = Response(FeedSerializer(instance=feed).data)
        set_vidfeed_user_cookie(r, feed.owner.email)
        ctx = {
            'feed': feed,
            'feed_owner': feed.owner.email,
        }

        send_email('feed_created', ctx, "New Feed Created for "+ feed.get_video_title(), feed.owner.email)
        return r


class FeedInviteList(APIView):
    def get_objects(self, feed_id):
        feed = get_object_or_404(Feed, feed_id=feed_id)
        return FeedInvite.objects.filter(feed=feed)

    def get(self, request, feed_id, format=None):
        serializer = FeedInviteSerializer(self.get_objects(feed_id), many=True)
        return Response(serializer.data)

    def post(self, request, feed_id, format=None):
        feed = get_object_or_404(Feed, feed_id=feed_id)
        d = json.loads(dict(request.data).items()[0][0])
        try:
            sender = SiteUser.objects.find_or_create_user(d.get('sender').strip())
        except AttributeError:
            return Response({"message": "Invalid sender"}, status=status.HTTP_400_BAD_REQUEST)

        invites = d.get('invites')
        if len(invites) == 0:
            return Response({"message": "Must specify at least one invitee"}, status=status.HTTP_400_BAD_REQUEST)

        list_recipients = []
        for u in invites:
            if not u or u in list_recipients:
                continue
            try:
                recipient = SiteUser.objects.find_or_create_user(u)
                feed.invite_user(recipient, sender)
                feed.add_collaborator(recipient)
                list_recipients.append(u)
            except ValidationError:
                pass

        if len(list_recipients) == 0:
            return Response({"message": "No valid invites"}, status=status.HTTP_400_BAD_REQUEST)

        args = {
            'feed': feed,
            'list_recipients': list_recipients,
            'sender' : sender,
        }
        send_email('invite_sent', args, "Successfully Invited {0} Collaborator{1}".format(len(list_recipients),"s" if len(list_recipients) > 1 else "") + " to " + feed.get_video_title(), sender.email)

        r = Response({"message": "successfully invited {0} users".format(len(list_recipients))})
        set_vidfeed_user_cookie(r, sender.email)
        return r


class FeedCollaboratorList(APIView):
    def get_objects(self, feed_id):
        feed = get_object_or_404(Feed, feed_id=feed_id)
        return FeedCollaborator.objects.filter(feed=feed)

    def get(self, request, feed_id, format=None):
        serializer = FeedCollaboratorSerializer(self.get_objects(feed_id), many=True)
        return Response(serializer.data)


@api_view(['POST'])
def register(request):
    user = UserSerializer(data=request.data)
    if user.is_valid():
        try:
            site_user = SiteUser.objects.register_user(user.data['email'], user.data['first_name'],
                                                       user.data['last_name'], user.data['password'])
            Subscription.objects.create(user=site_user, subscription_type=user.initial_data['subscription_type'])
        except IntegrityError:
            return Response({'email': ['Email already registered']}, status=status.HTTP_400_BAD_REQUEST)
        return Response(SiteUserSerializer(site_user).data, status=status.HTTP_201_CREATED)
    return Response(user._errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(generics.GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=self.request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data['user']
        django_login(request, user)
        r = Response(SiteUserSerializer(user).data, status=status.HTTP_200_OK)
        set_vidfeed_user_cookie(r, user.email)
        return r


class LogoutView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        django_logout(request)
        return Response({"success": "Successfully logged out."}, status=status.HTTP_200_OK)

    def get(self, request):
        django_logout(request)
        return Response({"success": "Successfully logged out."}, status=status.HTTP_200_OK)


class IsAuthenticatedView(APIView):
    permission_classes = (AllowAny,)

    def get(self, requet):
        is_authenticated = 'true' if requet.user.is_authenticated else 'false'
        return Response({"is_authenticated": is_authenticated})


class PasswordResetView(generics.GenericAPIView):

    """
    Calls Django Auth PasswordResetForm save method.

    Accepts the following POST parameters: email
    Returns the success/fail message.
    """

    serializer_class = PasswordResetSerializer
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        # Create a serializer with request.data
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        serializer.save()
        # Return the success message with OK HTTP status
        return Response(
            {"success": "Password reset e-mail has been sent."},
            status=status.HTTP_200_OK
        )


class PasswordResetConfirmView(generics.GenericAPIView):
    """
    Password reset e-mail link is confirmed, therefore this resets the user's password.

    Accepts the following POST parameters: new_password1, new_password2
    Accepts the following Django URL arguments: token, uid
    Returns the success/fail message.
    """

    serializer_class = PasswordResetConfirmSerializer
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"success": "Password has been reset with the new password."})


class ProjectList(APIView):
    permission_classes = (IsAuthenticated,)

    def get_objects(self, user):
        return Project.objects.filter(owner=user,
                                      deleted=False)

    """
    Create a new project.
    """
    def post(self, request, format=None):
        serializer = ProjectSerializer(data=request.data)
        if serializer.is_valid():
            serializer.validated_data['owner'] = request.user
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    """
    Get projects
    """
    def get(self, request, format=None):
        serializer = ProjectSerializer(self.get_objects(request.user), many=True)
        return Response(serializer.data)


class ProjectDetail(APIView):
    permission_classes = (IsAuthenticated,)

    def get_object(self, project_id, owner):
        return get_object_or_404(Project, pk=project_id, owner=owner)

    """
    Update project
    """
    def put(self, request, project_id, format=None):
        project = self.get_object(project_id, request.user)
        serializer = ProjectSerializer(project, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    """
    Delete project
    """
    def delete(self, request, project_id, format=None):
        project = self.get_object(project_id, request.user)
        project.deleted = True
        project.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ManageProjectFeeds(APIView):
    permission_classes = (IsAuthenticated,)

    def get_project(self, project_id, owner):
        return get_object_or_404(Project, pk=project_id, owner=owner, deleted=False)

    def get_feed(self, feed_id, owner):
        return get_object_or_404(Feed, feed_id=feed_id, owner=owner)

    def post(self, request, project_id, feed_id, format=None):
        project = self.get_project(project_id, request.user)
        feed = self.get_feed(feed_id, request.user)
        # currently a feed can't be in more than one project
        # this removes from all projects before adding to another
        projects = Project.objects.filter(feeds__feed_id=feed_id)
        for p in projects:
            p.feeds.remove(feed)
        project.feeds.add(feed)
        return Response({"message": "successfully added feed to project"}, status=status.HTTP_200_OK)

    def delete(self, request, project_id, feed_id, format=None):
        project = self.get_project(project_id, request.user)
        feed = self.get_feed(feed_id, request.user)
        project.feeds.remove(feed)
        return Response({"message": "successfully removed feed from project"}, status=status.HTTP_200_OK)


class ProjectFeedList(APIView):
    permission_classes = (IsAuthenticated,)

    def get_project(self, project_id, owner):
        return get_object_or_404(Project, pk=project_id, owner=owner, deleted=False)

    def get(self, request, project_id, format=None):
        project = self.get_project(project_id, request.user)
        serializer = FeedSerializer(project.feeds.filter(active=True).all(), many=True)
        return Response(serializer.data)


class FeedUpdateDetail(APIView):
    permission_classes = (IsAuthenticated,)

    def get_object(self, feed_id, owner):
        return get_object_or_404(Feed, feed_id=feed_id, owner=owner)

    """
    Update Feed
    """
    def put(self, request, feed_id, format=None):
        feed = self.get_object(feed_id, request.user)
        serializer = FeedUpdateSerializer(data=request.data)
        if serializer.is_valid():
            feed.video_title = serializer.data.get('title')
            feed.save()
            return Response(FeedSerializer(feed).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes((IsAuthenticated, ))
def get_vimeo_videos(request):
    subscription = Subscription.objects.get(user=request.user)
    if not subscription:
        return Response({"message": "Invalid subscription"}, status=status.HTTP_401_UNAUTHORIZED)
    v = vimeo.VimeoClient(
        token=subscription.vimeo_token,
        key=settings.VIMEO_CLIENT_IDENTIFIED,
        secret=settings.VIMEO_CLIENT_SECRET)

    try:
        video_list = v.get('/me/videos?per_page=100&fields=uri,name,pictures.sizes')
        if video_list.status_code == 200:
            return Response(video_list.json().get('data'), status=status.HTTP_200_OK)
        elif video_list.status_code == 401:
            return Response({'message': video_list.json().get('error')}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            logger.exception("error getting Videos from Vimeo. Error Code: {0}, Error Message: {1}".format(
                video_list.status_code, video_list.json().get('error')))
            return Response({"message": "Failed to load video list"}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as ex:
        logger.exception(ex)
        return Response({"message": ex.message}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes((IsAuthenticated, ))
def get_youtube_videos(request):
    subscription = Subscription.objects.get(user=request.user)
    if not subscription:
        return Response({"message": "Invalid subscription"}, status=status.HTTP_401_UNAUTHORIZED)

    http_auth = subscription.youtube_credentials.authorize(httplib2.Http())
    youtube = build('youtube', 'v3', http=http_auth)

    try:
        channels_response = youtube.channels().list(
            mine=True,
            part="contentDetails"
        ).execute()
    except HttpAccessTokenRefreshError as ex:
        return Response({'message': ex.message}, status=status.HTTP_401_UNAUTHORIZED)
    except Exception as ex:
        logger.exception(ex)
        return Response({'message': ex.message}, status=status.HTTP_400_BAD_REQUEST)

    uploads = []
    for channel in channels_response["items"]:
        # From the API response, extract the playlist ID that identifies the list
        # of videos uploaded to the authenticated user's channel.
        uploads_list_id = channel["contentDetails"]["relatedPlaylists"]["uploads"]
        # Retrieve the list of videos uploaded to the authenticated user's channel.
        playlistitems_list_request = youtube.playlistItems().list(
            playlistId=uploads_list_id,
            part="snippet",
            maxResults=50
        )
        while playlistitems_list_request:
            playlistitems_list_response = playlistitems_list_request.execute()
            for playlist_item in playlistitems_list_response["items"]:
                uploads.append({
                    'title': playlist_item["snippet"]["title"],
                    'video_id': playlist_item["snippet"]["resourceId"]["videoId"],
                    'thumbnails': playlist_item["snippet"]['thumbnails'],
                })
            playlistitems_list_request = youtube.playlistItems().list_next(
                playlistitems_list_request, playlistitems_list_response)
    return Response(uploads, status=status.HTTP_200_OK)
