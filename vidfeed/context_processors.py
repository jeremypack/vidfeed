
def vidfeed_user(request):
    return {
        'vidfeeduser': request.COOKIES.get('vidfeeduser')
    }