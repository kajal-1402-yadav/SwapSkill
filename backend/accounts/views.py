from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.db import models
from .models import User
from .serializers import (
    UserRegistrationSerializer, 
    UserLoginSerializer, 
    UserProfileSerializer,
    UserListSerializer
)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register(request):
    """Register a new user"""
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        login(request, user)
        return Response({
            'message': 'Registration successful',
            'user': UserProfileSerializer(user).data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    """Login user"""
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        login(request, user)
        print(f"Login - User: {user.full_name}, Session ID: {request.session.session_key}")
        print(f"Login - Session data: {dict(request.session)}")
        
        response = Response({
            'message': 'Login successful',
            'user': UserProfileSerializer(user).data
        })
        
        # Ensure session cookie is set
        if request.session.session_key:
            response.set_cookie(
                'sessionid',
                request.session.session_key,
                max_age=86400,  # 24 hours
                httponly=False,
                samesite=None,  # Allow cross-site requests in development
                secure=False,
                path='/',
                domain=None  # Use default domain
            )
            print(f"Login - Set session cookie: sessionid={request.session.session_key}")
        
        return response
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout_view(request):
    """Logout user"""
    logout(request)
    response = Response({'message': 'Logout successful'})
    response.delete_cookie('sessionid')
    return response

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def check_auth(request):
    """Check if user is authenticated"""
    print(f"Check auth - User: {request.user}, Authenticated: {request.user.is_authenticated}")
    print(f"Check auth - Session ID: {request.session.session_key}")
    print(f"Check auth - Cookies: {dict(request.COOKIES)}")
    print(f"Check auth - Session data: {dict(request.session)}")
    print(f"Check auth - User ID in session: {request.session.get('_auth_user_id')}")
    
    if request.user.is_authenticated:
        return Response({
            'authenticated': True,
            'user': UserProfileSerializer(request.user).data
        })
    return Response({'authenticated': False})

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def profile(request):
    """Get current user profile"""
    serializer = UserProfileSerializer(request.user)
    return Response(serializer.data)

@api_view(['PATCH'])
@permission_classes([permissions.IsAuthenticated])
def update_profile(request):
    """Update current user profile"""
    serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def upload_avatar(request):
    """Upload a new avatar image for the current user"""
    if 'avatar' not in request.FILES:
        return Response({'error': 'No avatar file provided'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Get the uploaded file
    avatar_file = request.FILES['avatar']
    
    # Validate file type
    allowed_types = ['image/jpeg', 'image/png', 'image/gif']
    if avatar_file.content_type not in allowed_types:
        return Response(
            {'error': 'Invalid file type. Only JPEG, PNG, and GIF are allowed.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Validate file size (max 5MB)
    if avatar_file.size > 5 * 1024 * 1024:
        return Response(
            {'error': 'File too large. Maximum size is 5MB.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Delete old avatar if it exists
    if request.user.avatar:
        request.user.avatar.delete(save=False)
    
    # Save the new avatar
    request.user.avatar = avatar_file
    request.user.save()
    
    return Response({
        'message': 'Avatar uploaded successfully',
        'avatar_url': request.user.avatar.url
    })

@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def delete_avatar(request):
    """Delete current user's avatar"""
    if request.user.avatar:
        request.user.avatar.delete()
        request.user.save()
        return Response({'message': 'Avatar deleted successfully'})
    return Response({'error': 'No avatar to delete'}, status=status.HTTP_400_BAD_REQUEST)

class UserListView(generics.ListAPIView):
    """List all users with search functionality"""
    serializer_class = UserListSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = User.objects.exclude(id=self.request.user.id).filter(is_active=True)
        search = self.request.query_params.get('search', None)
        
        if search:
            queryset = queryset.filter(
                models.Q(first_name__icontains=search) |
                models.Q(last_name__icontains=search) |
                models.Q(bio__icontains=search) |
                models.Q(location__icontains=search)
            )
        
        return queryset.order_by('-created_at')

class UserDetailView(generics.RetrieveAPIView):
    """Get detailed user information"""
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserListSerializer
    permission_classes = [permissions.IsAuthenticated]
