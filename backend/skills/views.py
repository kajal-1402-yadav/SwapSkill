from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Skill, UserSkill
from .serializers import SkillSerializer, UserSkillSerializer, UserSkillCreateSerializer

class SkillListView(generics.ListAPIView):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [permissions.IsAuthenticated]

class UserSkillListView(generics.ListCreateAPIView):
    serializer_class = UserSkillSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        qs = UserSkill.objects.filter(user=self.request.user)
        if not getattr(self.request.user, 'is_admin', False):
            qs = qs.filter(status='approved')
        return qs
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return UserSkillCreateSerializer
        return UserSkillSerializer
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        print(f"UserSkillListView - User: {request.user.full_name}")
        print(f"UserSkillListView - Skills found: {len(serializer.data)}")
        print(f"UserSkillListView - Data: {serializer.data}")
        return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def delete_user_skill(request, pk):
    try:
        user_skill = UserSkill.objects.get(pk=pk, user=request.user)
        user_skill.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except UserSkill.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_skills_by_type(request, skill_type):
    if skill_type not in ['offered', 'wanted']:
        return Response({'error': 'Invalid skill type'}, status=status.HTTP_400_BAD_REQUEST)
    
    skills = UserSkill.objects.filter(user=request.user, skill_type=skill_type)
    if not getattr(request.user, 'is_admin', False):
        skills = skills.filter(status='approved')
    serializer = UserSkillSerializer(skills, many=True)
    return Response(serializer.data)
