# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2017-02-03 16:13
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('feed', '0008_datamigration'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='done',
            field=models.BooleanField(default=False),
        ),
    ]
