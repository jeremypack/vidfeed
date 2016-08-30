from rest_framework import serializers
from vidfeed.feed.models import Feed, Comment, Provider
from vidfeed.profiles.models import SiteUser


class SiteUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteUser
        fields = ('id', 'email', 'first_name', 'last_name')


class ProviderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Provider
        fields = ('id', 'name', 'link_format')


class FeedSerializer(serializers.ModelSerializer):
    owner = SiteUserSerializer(many=False, read_only=True)
    provider = ProviderSerializer(many=False, read_only=True)

    class Meta:
        model = Feed
        fields = ('created', 'owner', 'feed_id', 'provider',
                  'video_id', 'video_title', 'video_thumbnail')


class CommentSerializer(serializers.ModelSerializer):
    author = serializers.EmailField(write_only=True, required=True)
    owner = SiteUserSerializer(many=False, read_only=True)
    created = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Comment
        fields = ('id', 'body', 'created', 'owner',
                  'timecode', 'author')

    def create(self, validated_data):
        author = validated_data.pop('author')
        owner = SiteUser.objects.find_or_create_user(author)
        return Comment.objects.create(owner=owner, **validated_data)
