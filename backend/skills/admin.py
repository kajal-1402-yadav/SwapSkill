from django.contrib import admin
from .models import Skill, UserSkill

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'created_at')
    list_filter = ('category',)
    search_fields = ('name',)

@admin.register(UserSkill)
class UserSkillAdmin(admin.ModelAdmin):
    list_display = (
        'user', 'skill', 'skill_type', 'proficiency_level', 'status', 'rejection_reason', 'created_at'
    )
    list_filter = (
        'skill_type', 'proficiency_level', 'skill__category', 'status'
    )
    search_fields = ('user__email', 'skill__name')
    actions = ['approve_skills', 'reject_skills']

    def approve_skills(self, request, queryset):
        updated = queryset.update(status='approved', rejection_reason=None)
        self.message_user(request, f"{updated} skill(s) approved.")
    approve_skills.short_description = "Approve selected skills"

    def reject_skills(self, request, queryset):
        for obj in queryset:
            obj.status = 'rejected'
            # Optionally, set a default rejection reason or prompt for input in the future
            if not obj.rejection_reason:
                obj.rejection_reason = 'Rejected by admin.'
            obj.save()
        self.message_user(request, f"{queryset.count()} skill(s) rejected.")
    reject_skills.short_description = "Reject selected skills (default reason: 'Rejected by admin.')"
