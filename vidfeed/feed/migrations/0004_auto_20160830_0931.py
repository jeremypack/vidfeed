# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-08-30 09:31
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('feed', '0003_datamigration'),
    ]

    operations = [
        migrations.RenameField(
            model_name='comment',
            old_name='timestamp',
            new_name='timecode',
        ),
    ]
