from __future__ import absolute_import

from .base import *


WEBPACK_LOADER = {
    'DEFAULT': {
        'BUNDLE_DIR_NAME': 'dist/',
        'STATS_FILE': os.path.join(os.path.dirname(BASE_DIR), 'webpack-stats-prod.json'),
    }
}

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'live',
        'USER': 'vidfeed_live',
        'PASSWORD': 'Hti5ExjnbDpgpDd',
        'HOST': '127.0.0.1',
        'PORT': '5432',
    }
}


########## SITE SETTINGS
YOUTUBE_API_KEY = 'AIzaSyDvSM-xqZ_P2g2asg7DO-0z1R4CL9d8OXA'
COOKIE_DOMAIN = 'vidfeed.io'
BASE_URL = 'http://vidfeed.io'
########## END SITE SETTINGS
