from rest_framework import serializers
from vidfeed.feed.models import Feed, Comment
from vidfeed.profiles.models import SiteUser


class SiteUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteUser
        fields = ('id', 'email', 'first_name', 'last_name')


class CommentSerializer(serializers.ModelSerializer):
    owner = SiteUserSerializer(many=False, read_only=True)

    class Meta:
        model = Comment
        fields = ('id', 'body', 'created', 'owner')
