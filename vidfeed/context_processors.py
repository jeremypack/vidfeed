from django.conf import settings
from vidfeed.profiles.models import SiteUser


def vidfeed_user(request):
    vidfeeduser = request.COOKIES.get('vidfeeduser')
    vidfeeduser_id = None
    if vidfeeduser:
        try:
            u = SiteUser.objects.get(email=vidfeeduser)
            vidfeeduser_id = u.id
        except SiteUser.DoesNotExist:
            pass


    return {
        'vidfeeduser': request.COOKIES.get('vidfeeduser'),
        'vidfeeduser_id': vidfeeduser_id,
        'localhost': settings.LOCAL,
    }
