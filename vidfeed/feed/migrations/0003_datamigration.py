# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations


def data_migration(apps, schema_editor):
    Provider = apps.get_model('feed', 'Provider')
    ProviderExpression = apps.get_model('feed', 'ProviderExpression')
    youtube_provider = Provider.objects.get(name='youtube')
    vimeo_provider = Provider.objects.get(name='vimeo')

    ProviderExpression.objects.create(provider=youtube_provider,
                                      discover_expression='youtu\.be/(?P<video_id>[a-z1-9.-_]+)')

    ProviderExpression.objects.create(provider=youtube_provider,
                                      discover_expression='youtube\.com/(?:.+)v=(?P<video_id>[^&]+)')

    ProviderExpression.objects.create(provider=vimeo_provider,
                                      discover_expression='vimeo\.com(?:.*/)*(?P<video_id>[1-9.-_]+)')


class Migration(migrations.Migration):

    dependencies = [
        ('feed', '0002_datamigration'),
    ]

    operations = [
        migrations.RunPython(data_migration),
    ]
