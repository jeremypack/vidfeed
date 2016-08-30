from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from vidfeed.feed.models import Comment, Feed, Provider
from vidfeed.utils import get_youtube_title_and_thumbnail, get_vimeo_title_and_thumbnail
from serializers import CommentSerializer, FeedSerializer

#
# def post_comment(request, feed_id):
#     pass

class CommentList(APIView):
    def get_objects(self, feed_id):
        feed = get_object_or_404(Feed, feed_id=feed_id)
        return Comment.objects.filter(feed=feed, deleted=False)

    def get(self, request, feed_id, format=None):
        serializer = CommentSerializer(self.get_objects(feed_id), many=True)
        return Response(serializer.data)

    def post(self, request, feed_id, format=None):
        feed = get_object_or_404(Feed, feed_id=feed_id)
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(feed=feed)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CommentDetail(APIView):
    def get_object(self, feed_id, pk):
        return get_object_or_404(Comment, feed__feed_id=feed_id, pk=pk)

    def put(self, request, feed_id, comment_id, format=None):
        snippet = self.get_object(feed_id, comment_id)
        serializer = CommentSerializer(snippet, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
        return get_object_or_404(Feed, feed_id=feed_id)

    def get(self, request, feed_id, format=None):
        snippet = self.get_object(feed_id)
        serializer = FeedSerializer(snippet)
        return Response(serializer.data)
