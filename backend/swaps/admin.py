from django.contrib import admin
from .models import SwapRequest, SwapSession, SwapRating
import csv
from django.http import HttpResponse

@admin.register(SwapRequest)
class SwapRequestAdmin(admin.ModelAdmin):
    list_display = ('from_user', 'to_user', 'skill_offered', 'skill_wanted', 'status', 'created_at')
    list_filter = ('status', 'duration', 'preferred_time', 'created_at')
    search_fields = ('from_user__email', 'to_user__email', 'skill_offered__name', 'skill_wanted__name')
    actions = ['export_swaps_csv']

    def export_swaps_csv(self, request, queryset):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename=swaps.csv'
        writer = csv.writer(response)
        writer.writerow(['ID', 'From User', 'To User', 'Skill Offered', 'Skill Wanted', 'Status', 'Duration', 'Preferred Time', 'Created At'])
        for swap in queryset:
            writer.writerow([
                swap.id, swap.from_user.full_name, swap.to_user.full_name, swap.skill_offered.name, swap.skill_wanted.name, swap.status, swap.duration, swap.preferred_time, swap.created_at
            ])
        return response
    export_swaps_csv.short_description = "Export selected swaps as CSV"

@admin.register(SwapSession)
class SwapSessionAdmin(admin.ModelAdmin):
    list_display = ('swap_request', 'scheduled_date', 'completed', 'created_at')
    list_filter = ('completed', 'created_at')
    actions = ['export_sessions_csv']

    def export_sessions_csv(self, request, queryset):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename=sessions.csv'
        writer = csv.writer(response)
        writer.writerow(['ID', 'Swap Request', 'Scheduled Date', 'Completed', 'Notes', 'Created At'])
        for session in queryset:
            writer.writerow([
                session.id, str(session.swap_request), session.scheduled_date, session.completed, session.notes, session.created_at
            ])
        return response
    export_sessions_csv.short_description = "Export selected sessions as CSV"

@admin.register(SwapRating)
class SwapRatingAdmin(admin.ModelAdmin):
    list_display = ('swap_session', 'from_user', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    actions = ['export_ratings_csv']

    def export_ratings_csv(self, request, queryset):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename=ratings.csv'
        writer = csv.writer(response)
        writer.writerow(['ID', 'Swap Session', 'From User', 'Rating', 'Comment', 'Created At'])
        for rating in queryset:
            writer.writerow([
                rating.id, str(rating.swap_session), rating.from_user.full_name, rating.rating, rating.comment, rating.created_at
            ])
        return response
    export_ratings_csv.short_description = "Export selected ratings as CSV"
