# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2017-02-22 15:02
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('feed', '0011_merge_20170220_1530'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='project',
            options={'ordering': ('created',)},
        ),
    ]
