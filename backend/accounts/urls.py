from django.urls import path
from . import views
from . import admin_api

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('check/', views.check_auth, name='check_auth'),
    path('profile/', views.profile, name='profile'),
    path('profile/update/', views.update_profile, name='update_profile'),
    path('profile/avatar/', views.upload_avatar, name='upload_avatar'),  # New endpoint
    path('profile/avatar/delete/', views.delete_avatar, name='delete_avatar'),
    path('users/', views.UserListView.as_view(), name='user_list'),
    path('users/<int:pk>/', views.UserDetailView.as_view(), name='user_detail'),
]

urlpatterns += [
    # Admin API endpoints
    path('admin/user-skills/', admin_api.admin_list_user_skills, name='admin_list_user_skills'),
    path('admin/user-skills/<int:pk>/approve/', admin_api.admin_approve_skill, name='admin_approve_skill'),
    path('admin/user-skills/<int:pk>/reject/', admin_api.admin_reject_skill, name='admin_reject_skill'),

    path('admin/users/', admin_api.admin_list_users, name='admin_list_users'),
    path('admin/users/<int:pk>/ban/', admin_api.admin_ban_user, name='admin_ban_user'),
    path('admin/users/<int:pk>/unban/', admin_api.admin_unban_user, name='admin_unban_user'),

    path('admin/swaps/', admin_api.admin_list_swaps, name='admin_list_swaps'),

    path('admin/messages/', admin_api.admin_messages, name='admin_messages'),
    path('admin/messages/<int:pk>/', admin_api.admin_update_message, name='admin_update_message'),

    path('admin/export/users/', admin_api.admin_export_users_csv, name='admin_export_users_csv'),
    path('admin/export/swaps/', admin_api.admin_export_swaps_csv, name='admin_export_swaps_csv'),
    path('admin/export/ratings/', admin_api.admin_export_ratings_csv, name='admin_export_ratings_csv'),
]
