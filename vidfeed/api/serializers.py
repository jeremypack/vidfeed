from rest_framework import serializers
from vidfeed.feed.models import Feed, Comment


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('id', 'body', 'created', 'owner')
