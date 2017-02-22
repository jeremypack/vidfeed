# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations


def data_migration(apps, schema_editor):
    SiteUser = apps.get_model('profiles', 'SiteUser')
    SiteUser.objects.filter(is_superuser=False).update(is_active=False)


class Migration(migrations.Migration):

    dependencies = [
       ('profiles', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(data_migration),
    ]
