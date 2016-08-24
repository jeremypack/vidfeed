from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import mixins

from vidfeed.feed.models import Comment, Feed
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
