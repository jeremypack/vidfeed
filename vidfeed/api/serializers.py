from rest_framework import serializers
from vidfeed.feed.models import Feed, Comment, Provider, FeedInvite, FeedCollaborator
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


class ChildCommentSerializer(serializers.ModelSerializer):
    author = serializers.EmailField(write_only=True, required=True)
    owner = SiteUserSerializer(many=False, read_only=True)
    created = serializers.DateTimeField(read_only=True)
    parent_id = serializers.IntegerField(required=False)

    class Meta:
        model = Comment
        fields = ('id', 'body', 'created', 'owner',
                  'timecode', 'author', 'parent_id',)


class CommentSerializer(serializers.ModelSerializer):
    author = serializers.EmailField(write_only=True, required=True)
    owner = SiteUserSerializer(many=False, read_only=True)
    created = serializers.DateTimeField(read_only=True)
    parent_id = serializers.IntegerField(required=False)
    children = ChildCommentSerializer(many=True, read_only=True)

    class Meta:
        model = Comment
        fields = ('id', 'body', 'created', 'owner',
                  'timecode', 'author', 'parent_id',
                  'children')

    def create(self, validated_data):
        author = validated_data.pop('author')
        parent_id = validated_data.pop('parent_id', None)
        parent = None
        if parent_id:
            parent = Comment.objects.get(feed=validated_data['feed'],
                                         deleted=False, id=parent_id)
        owner = SiteUser.objects.find_or_create_user(author)
        return Comment.objects.create(owner=owner,
                                      parent_comment=parent, **validated_data)

    def update(self, instance, validated_data):
        # only allow update of
        instance.body = validated_data.pop('body')
        instance.save()
        return instance


class FeedInviteSerializer(serializers.ModelSerializer):
    sender = SiteUserSerializer(many=False, read_only=True)
    recipient = SiteUserSerializer(many=False, read_only=True)

    class Meta:
        model = FeedInvite
        fields = ('recipient', 'sender', 'created',)


class FeedCollaboratorSerializer(serializers.ModelSerializer):
    user = SiteUserSerializer(many=False, read_only=True)

    class Meta:
        model = FeedCollaborator
        fields = ('user', 'created',)
