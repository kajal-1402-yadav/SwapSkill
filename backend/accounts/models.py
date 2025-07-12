from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    email = models.EmailField(unique=True)
    bio = models.TextField(max_length=500, blank=True)
    location = models.CharField(max_length=100, blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    availability = models.CharField(max_length=50, choices=[
        ('weekdays', 'Weekdays'),
        ('weekends', 'Weekends'),
        ('evenings', 'Evenings'),
        ('mornings', 'Mornings'),
        ('flexible', 'Flexible'),
    ], blank=True)
    experience_level = models.CharField(max_length=50, choices=[
        ('beginner', 'Beginner (0-1 years)'),
        ('intermediate', 'Intermediate (2-4 years)'),
        ('advanced', 'Advanced (5+ years)'),
        ('expert', 'Expert (10+ years)'),
    ], blank=True)
    response_time = models.CharField(max_length=100, choices=[
        ('1hour', 'Usually responds within 1 hour'),
        ('3hours', 'Usually responds within 3 hours'),
        ('24hours', 'Usually responds within 24 hours'),
        ('2-3days', 'Usually responds within 2-3 days'),
    ], blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)
    completed_swaps = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Admin and ban fields
    is_admin = models.BooleanField(default=False, help_text="Designates whether the user is an admin with special permissions.")
    is_banned = models.BooleanField(default=False, help_text="Designates whether the user is banned from the platform.")

    # Role field
    ROLE_CHOICES = [
        ('user', 'User'),
        ('admin', 'Admin'),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip()


class PlatformMessage(models.Model):
    title = models.CharField(max_length=200)
    body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    expires_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return self.title
