# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations


def data_migration(apps, schema_editor):
    ProviderExpression = apps.get_model('feed', 'ProviderExpression')

    ex = ProviderExpression.objects.get(pk=3)
    ex.discover_expression = 'https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(?P<video_id>\d+)(?:$|\/|\?)'
    ex.save()


class Migration(migrations.Migration):

    dependencies = [
        ('feed', '0007_auto_20161110_1215'),
    ]

    operations = [
        migrations.RunPython(data_migration),
    ]
