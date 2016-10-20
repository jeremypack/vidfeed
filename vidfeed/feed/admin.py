from django.contrib import admin
from django.db.models import Count
from models import Feed, Comment, Provider


# Register your models here.
class FeedAdmin(admin.ModelAdmin):
    list_display = ('owner', 'full_name', 'provider', 'feed_id', 'video_id',  'created',)

    def full_name(self, inst):
        return inst.get_full_name()

admin.site.register(Feed, FeedAdmin)
admin.site.register(Comment)
admin.site.register(Provider)
