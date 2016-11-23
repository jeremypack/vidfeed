from django.contrib import admin
from django.db.models import Count
from models import Feed, Comment, Provider


# Register your models here.
class FeedAdmin(admin.ModelAdmin):
    list_display = ('owner', 'full_name', 'provider', 'feed_id', 'video_id', 'comment_count', 'created',)

    def full_name(self, inst):
        return inst.get_full_name()

    def comment_count(self, inst):
        return inst.comment_set.count()
    comment_count.admin_order_field = 'comment_count'


admin.site.register(Feed, FeedAdmin)
admin.site.register(Comment)
admin.site.register(Provider)
