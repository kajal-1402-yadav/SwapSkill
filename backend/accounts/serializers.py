from rest_framework import serializers
from django.contrib.auth import authenticate, login, logout
from .models import User, PlatformMessage

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('email', 'username', 'first_name', 'last_name', 'password', 'password_confirm', 'role')

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        # Always set role to 'user' regardless of input
        attrs['role'] = 'user'
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            user = authenticate(username=email, password=password)
            if not user:
                raise serializers.ValidationError('Invalid credentials')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled')
            if getattr(user, 'is_banned', False):
                raise serializers.ValidationError('This account has been banned. Please contact support.')
            attrs['user'] = user
        else:
            raise serializers.ValidationError('Must include email and password')
        
        return attrs

class UserProfileSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    skills_offered = serializers.SerializerMethodField()
    skills_wanted = serializers.SerializerMethodField()
    is_admin = serializers.BooleanField(read_only=True)
    is_staff = serializers.BooleanField(read_only=True)
    is_superuser = serializers.BooleanField(read_only=True)
    role = serializers.CharField(read_only=True)
    
    class Meta:
        model = User
        fields = (
            'id', 'email', 'username', 'first_name', 'last_name', 'full_name',
            'bio', 'location', 'avatar', 'availability', 'experience_level',
            'response_time', 'rating', 'completed_swaps', 'created_at',
            'skills_offered', 'skills_wanted',
            'is_admin', 'is_staff', 'is_superuser', 'role'
        )
        read_only_fields = ('id', 'email', 'rating', 'completed_swaps', 'created_at')
    
    def get_skills_offered(self, obj):
        from skills.models import UserSkill
        skills = UserSkill.objects.filter(user=obj, skill_type='offered')
        return [skill.skill.name for skill in skills]
    
    def get_skills_wanted(self, obj):
        from skills.models import UserSkill
        skills = UserSkill.objects.filter(user=obj, skill_type='wanted')
        return [skill.skill.name for skill in skills]

class UserListSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    skills_offered = serializers.SerializerMethodField()
    skills_wanted = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = (
            'id', 'full_name', 'avatar', 'location', 'availability',
            'rating', 'skills_offered', 'skills_wanted', 'bio'
        )
    
    def get_skills_offered(self, obj):
        from skills.models import UserSkill
        skills = UserSkill.objects.filter(user=obj, skill_type='offered')
        return [skill.skill.name for skill in skills]
    
    def get_skills_wanted(self, obj):
        from skills.models import UserSkill
        skills = UserSkill.objects.filter(user=obj, skill_type='wanted')
        return [skill.skill.name for skill in skills]

class PlatformMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlatformMessage
        fields = ['id', 'title', 'body', 'created_at', 'is_active', 'expires_at']
