# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations


def data_migration(apps, schema_editor):
    Provider = apps.get_model('feed', 'Provider')
    Provider.objects.create(name='youtube',
                            link_format='https://www.youtube.com/watch?v={video_id}')
    Provider.objects.create(name='vimeo',
                            link_format='https://vimeo.com/{video_id}')


class Migration(migrations.Migration):

    dependencies = [
        ('feed', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(data_migration),
    ]
