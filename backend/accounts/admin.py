from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, PlatformMessage
import csv
from django.http import HttpResponse

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'first_name', 'last_name', 'is_staff', 'is_admin', 'is_banned', 'rating', 'completed_swaps')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'is_admin', 'is_banned', 'availability', 'experience_level')
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email',)
    actions = ['ban_users', 'unban_users', 'export_users_csv']
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Profile Information', {
            'fields': ('bio', 'location', 'avatar', 'availability', 'experience_level', 'response_time')
        }),
        ('Statistics', {
            'fields': ('rating', 'completed_swaps')
        }),
        ('Admin/Ban', {
            'fields': ('is_admin', 'is_banned')
        }),
    )

    def ban_users(self, request, queryset):
        updated = queryset.update(is_banned=True)
        self.message_user(request, f"{updated} user(s) banned.")
    ban_users.short_description = "Ban selected users"

    def unban_users(self, request, queryset):
        updated = queryset.update(is_banned=False)
        self.message_user(request, f"{updated} user(s) unbanned.")
    unban_users.short_description = "Unban selected users"

    def export_users_csv(self, request, queryset):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename=users.csv'
        writer = csv.writer(response)
        writer.writerow(['ID', 'Email', 'Full Name', 'Location', 'Rating', 'Completed Swaps', 'Is Banned', 'Is Admin', 'Created At'])
        for user in queryset:
            writer.writerow([
                user.id, user.email, user.full_name, user.location, user.rating, user.completed_swaps, user.is_banned, user.is_admin, user.created_at
            ])
        return response
    export_users_csv.short_description = "Export selected users as CSV"

@admin.register(PlatformMessage)
class PlatformMessageAdmin(admin.ModelAdmin):
    list_display = ('title', 'is_active', 'created_at', 'expires_at')
    list_filter = ('is_active', 'created_at', 'expires_at')
    search_fields = ('title', 'body')
