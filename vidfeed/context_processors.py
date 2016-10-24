from django.conf import settings

def vidfeed_user(request):
    return {
        'vidfeeduser': request.COOKIES.get('vidfeeduser'), 
        'localhost': settings.LOCAL,
    }
