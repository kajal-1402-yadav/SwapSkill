# Generated by Django 5.2.3 on 2025-07-12 10:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0003_platformmessage'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='role',
            field=models.CharField(choices=[('user', 'User'), ('admin', 'Admin')], default='user', max_length=10),
        ),
    ]
