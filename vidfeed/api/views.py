from rest_framework.views import APIView
from rest_framework.response import Response

from vidfeed.feed.models import Comment
from serializers import CommentSerializer


class CommentList(APIView):
    def get(self, request, format=None):
        comments = Comment.objects.all()
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)