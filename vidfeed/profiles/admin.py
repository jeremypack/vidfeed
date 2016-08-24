from django.contrib import admin
from models import SiteUser


class SiteUserAdmin(admin.ModelAdmin):
    list_display = ('email', 'first_name', 'last_name', 'date_joined', 'last_login', 'is_superuser',)


admin.site.register(SiteUser, SiteUserAdmin)
