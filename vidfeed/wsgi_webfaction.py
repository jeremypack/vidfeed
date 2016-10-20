import os
import site
from os.path import abspath, dirname
from sys import path

site.addsitedir('/home/package3/.virtualenvs/vidfeed_live/lib/python2.7/site-packages')

SITE_ROOT = dirname(dirname(abspath(__file__)))
path.append(SITE_ROOT)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "package3.settings.webfaction")

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
