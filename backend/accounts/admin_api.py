from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.http import HttpResponse
from django.contrib.auth import get_user_model
from skills.models import UserSkill
from skills.serializers import UserSkillSerializer
from swaps.models import SwapRequest, SwapSession, SwapRating
from swaps.serializers import SwapRequestSerializer, SwapRatingSerializer
from .models import PlatformMessage
from .serializers import PlatformMessageSerializer
import csv

# Custom permission for admin users only
def is_admin(user):
    return getattr(user, 'is_admin', False) or getattr(user, 'is_staff', False) or getattr(user, 'is_superuser', False)

class IsAdminUser(IsAuthenticated):
    def has_permission(self, request, view):
        return super().has_permission(request, view) and is_admin(request.user)

# 1. Skill Moderation
@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_list_user_skills(request):
    skills = UserSkill.objects.all().select_related('user', 'skill')
    serializer = UserSkillSerializer(skills, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def admin_approve_skill(request, pk):
    try:
        skill = UserSkill.objects.get(pk=pk)
        skill.status = 'approved'
        skill.rejection_reason = ''
        skill.save()
        return Response({'success': True, 'id': skill.id})
    except UserSkill.DoesNotExist:
        return Response({'error': 'Skill not found'}, status=404)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def admin_reject_skill(request, pk):
    try:
        skill = UserSkill.objects.get(pk=pk)
        reason = request.data.get('rejection_reason', 'Rejected by admin.')
        skill.status = 'rejected'
        skill.rejection_reason = reason
        skill.save()
        return Response({'success': True, 'id': skill.id})
    except UserSkill.DoesNotExist:
        return Response({'error': 'Skill not found'}, status=404)

# 2. User Management
User = get_user_model()

@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_list_users(request):
    users = User.objects.all()
    data = [
        {
            'id': u.id,
            'email': u.email,
            'full_name': u.full_name,
            'is_banned': u.is_banned,
            'is_admin': u.is_admin,
            'created_at': u.created_at,
        } for u in users
    ]
    return Response(data)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def admin_ban_user(request, pk):
    try:
        user = User.objects.get(pk=pk)
        user.is_banned = True
        user.save()
        return Response({'success': True, 'id': user.id})
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def admin_unban_user(request, pk):
    try:
        user = User.objects.get(pk=pk)
        user.is_banned = False
        user.save()
        return Response({'success': True, 'id': user.id})
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)

# 3. Swap Monitoring
@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_list_swaps(request):
    swaps = SwapRequest.objects.all().select_related('from_user', 'to_user', 'skill_offered', 'skill_wanted')
    serializer = SwapRequestSerializer(swaps, many=True)
    return Response(serializer.data)

# 4. Platform Messages
@api_view(['GET', 'POST'])
@permission_classes([IsAdminUser])
def admin_messages(request):
    if request.method == 'GET':
        messages = PlatformMessage.objects.all().order_by('-created_at')
        serializer = PlatformMessageSerializer(messages, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = PlatformMessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def admin_update_message(request, pk):
    try:
        msg = PlatformMessage.objects.get(pk=pk)
    except PlatformMessage.DoesNotExist:
        return Response({'error': 'Message not found'}, status=404)
    serializer = PlatformMessageSerializer(msg, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)

# 5. Reports (CSV)
@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_export_users_csv(request):
    users = User.objects.all()
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename=users.csv'
    writer = csv.writer(response)
    writer.writerow(['ID', 'Email', 'Full Name', 'Is Banned', 'Is Admin', 'Created At'])
    for u in users:
        writer.writerow([u.id, u.email, u.full_name, u.is_banned, u.is_admin, u.created_at])
    return response

@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_export_swaps_csv(request):
    swaps = SwapRequest.objects.all().select_related('from_user', 'to_user', 'skill_offered', 'skill_wanted')
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename=swaps.csv'
    writer = csv.writer(response)
    writer.writerow(['ID', 'From User', 'To User', 'Skill Offered', 'Skill Wanted', 'Status', 'Duration', 'Preferred Time', 'Created At'])
    for swap in swaps:
        writer.writerow([
            swap.id, swap.from_user.full_name, swap.to_user.full_name, swap.skill_offered.name, swap.skill_wanted.name, swap.status, swap.duration, swap.preferred_time, swap.created_at
        ])
    return response

@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_export_ratings_csv(request):
    ratings = SwapRating.objects.all().select_related('swap_session', 'from_user')
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename=ratings.csv'
    writer = csv.writer(response)
    writer.writerow(['ID', 'Swap Session', 'From User', 'Rating', 'Comment', 'Created At'])
    for rating in ratings:
        writer.writerow([
            rating.id, str(rating.swap_session), rating.from_user.full_name, rating.rating, rating.comment, rating.created_at
        ])
    return response 