from django.utils.translation import ugettext_lazy as _
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.forms import PasswordResetForm, SetPasswordForm
from django.contrib.auth.tokens import default_token_generator
from django.conf import settings
from django.utils.encoding import force_text
from django.utils.http import urlsafe_base64_decode as uid_decoder

from rest_framework import serializers, exceptions
from rest_framework.exceptions import ValidationError
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


class FeedUpdateSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=500, required=True)


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


class PasswordResetSerializer(serializers.Serializer):

    """
    Serializer for requesting a password reset e-mail.
    """

    email = serializers.EmailField()
    password_reset_form_class = PasswordResetForm

    def get_email_options(self):
        return {

            'email_template_name': 'emails/password_reset.txt',
            'html_email_template_name': 'emails/password_reset.html',
            'subject_template_name': 'emails/password_reset_subject.txt',
            'extra_email_context': {
                'base_url': settings.BASE_URL,
            }
        }

    def validate_email(self, value):
        # Create PasswordResetForm with the serializer
        self.reset_form = self.password_reset_form_class(data=self.initial_data)
        if not self.reset_form.is_valid():
            raise serializers.ValidationError(self.reset_form.errors)

        return value

    def save(self):
        request = self.context.get('request')
        # Set some values to trigger the send_email method.
        opts = {
            'use_https': request.is_secure(),
            'from_email': getattr(settings, 'DEFAULT_FROM_EMAIL'),
            'request': request,
        }

        opts.update(self.get_email_options())
        self.reset_form.save(**opts)


class PasswordResetConfirmSerializer(serializers.Serializer):
    """
    Serializer for requesting a password reset e-mail.
    """

    new_password1 = serializers.CharField(max_length=128)
    new_password2 = serializers.CharField(max_length=128)

    uid = serializers.CharField(required=True)
    token = serializers.CharField(required=True)

    set_password_form_class = SetPasswordForm

    def custom_validation(self, attrs):
        pass

    def validate(self, attrs):
        self._errors = {}

        # Decode the uidb64 to uid to get User object
        try:
            uid = force_text(uid_decoder(attrs['uid']))
            self.user = SiteUser.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, SiteUser.DoesNotExist):
            raise ValidationError({'uid': ['Invalid value']})

        self.custom_validation(attrs)
        # Construct SetPasswordForm instance
        self.set_password_form = self.set_password_form_class(
            user=self.user, data=attrs
        )
        if not self.set_password_form.is_valid():
            raise serializers.ValidationError(self.set_password_form.errors)
        if not default_token_generator.check_token(self.user, attrs['token']):
            raise ValidationError({'token': ['Invalid value']})

        return attrs

    def save(self):
        self.set_password_form.save()