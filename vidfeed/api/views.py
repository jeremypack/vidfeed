from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from vidfeed.feed.models import Comment, Feed, Provider
from vidfeed.utils import get_youtube_title_and_thumbnail, get_vimeo_title_and_thumbnail
from serializers import CommentSerializer, FeedSerializer


class CommentList(APIView):
    def get(self, request, format=None):
        comments = Comment.objects.all()
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)


class FeedList(APIView):
    def get(self, request, format=None):
        feeds = Feed.objects.all()
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

        feed = Feed.objects.create(feed_id=Feed.generate_link_id(),
                                   provider=provider,
                                   video_id=video_id,
                                   active=True,
                                   video_title=title,
                                   video_thumbnail=thumb)
        return Response(FeedSerializer(instance=feed).data)


class FeedDetail(APIView):
    def get_object(self, feed_id):
        try:
            return Feed.objects.get(feed_id=feed_id)
        except Feed.DoesNotExist:
            raise Http404

    def get(self, request, feed_id, format=None):
        snippet = self.get_object(feed_id)
        serializer = FeedSerializer(snippet)
        return Response(serializer.data)
