# Generated by Django 4.2.7 on 2025-07-12 06:07

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('skills', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='SwapRequest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message', models.TextField()),
                ('duration', models.CharField(choices=[('30min', '30 minutes'), ('1hour', '1 hour'), ('1.5hours', '1.5 hours'), ('2hours', '2 hours'), ('flexible', 'Flexible')], max_length=20)),
                ('preferred_time', models.CharField(choices=[('weekday-morning', 'Weekday Morning'), ('weekday-afternoon', 'Weekday Afternoon'), ('weekday-evening', 'Weekday Evening'), ('weekend-morning', 'Weekend Morning'), ('weekend-afternoon', 'Weekend Afternoon'), ('weekend-evening', 'Weekend Evening'), ('flexible', 'Flexible')], max_length=30)),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('rejected', 'Rejected'), ('completed', 'Completed'), ('cancelled', 'Cancelled')], default='pending', max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('from_user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sent_requests', to=settings.AUTH_USER_MODEL)),
                ('skill_offered', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='offered_in_swaps', to='skills.skill')),
                ('skill_wanted', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='wanted_in_swaps', to='skills.skill')),
                ('to_user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='received_requests', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='SwapSession',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('scheduled_date', models.DateTimeField()),
                ('completed', models.BooleanField(default=False)),
                ('notes', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('swap_request', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='swaps.swaprequest')),
            ],
        ),
        migrations.CreateModel(
            name='SwapRating',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rating', models.IntegerField(choices=[(1, 1), (2, 2), (3, 3), (4, 4), (5, 5)])),
                ('comment', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('from_user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('swap_session', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='ratings', to='swaps.swapsession')),
            ],
            options={
                'unique_together': {('swap_session', 'from_user')},
            },
        ),
    ]
