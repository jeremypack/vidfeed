from django.utils.translation import ugettext_lazy as _
from django.contrib.auth import get_user_model, authenticate


from rest_framework import serializers, exceptions
from vidfeed.feed.models import Feed, Comment, Provider, FeedInvite, \
    FeedCollaborator, Project
from vidfeed.profiles.models import SiteUser



class SiteUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteUser
        fields = ('id', 'email', 'first_name', 'last_name')


class UserSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(max_length=200, required=True)
    last_name = serializers.CharField(max_length=200, required=True)
    password = serializers.CharField(max_length=500, required=True)


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
                  'video_id', 'video_title', 'video_thumbnail',
                  'comment_count', 'collaborator_count')


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
    done = serializers.BooleanField(read_only=True)
    parent_id = serializers.IntegerField(required=False)
    children = ChildCommentSerializer(many=True, read_only=True)

    class Meta:
        model = Comment
        fields = ('id', 'body', 'created', 'owner',
                  'timecode', 'author', 'parent_id',
                  'children', 'done',)

    def create(self, validated_data):
        author = validated_data.pop('author')
        parent_id = validated_data.pop('parent_id', None)
        parent = None
        has_notified = False
        if parent_id:
            parent = Comment.objects.get(feed=validated_data['feed'],
                                         deleted=False, id=parent_id)
            has_notified = True
        owner = SiteUser.objects.find_or_create_user(author)
        return Comment.objects.create(owner=owner, has_notified=has_notified,
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


class FeedInvitesSerializer(serializers.Serializer):
    sender = serializers.EmailField()
    invites = serializers.ListField(child=serializers.EmailField())


class CommentDoneSerializer(serializers.Serializer):
    done = serializers.BooleanField(required=True)


class ProjectSerializer(serializers.ModelSerializer):
    owner = SiteUserSerializer(many=False, read_only=True)
    created = serializers.ReadOnlyField()

    class Meta:
        model = Project
        fields = ('id', 'title', 'created', 'owner',)


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(style={'input_type': 'password'})

    def _validate_email(self, email, password):
        user = None

        if email and password:
            user = authenticate(email=email.lower(), password=password)
        else:
            msg = _('Must include "email" and "password".')
            raise exceptions.ValidationError(msg)

        return user

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        user = self._validate_email(email, password)

        # Did we get back an active user?
        if user:
            if not user.is_active:
                msg = _('Sorry this user account is disabled. Please contact support.')
                raise exceptions.ValidationError(msg)
        else:
            msg = _("Sorry, we don't recognise this email, password combination. Please try again.")
            raise exceptions.ValidationError(msg)

        attrs['user'] = user
        return attrs