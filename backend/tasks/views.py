from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Task
from .serializers import TaskSerializer


class TaskViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing Task instances.
    Only authenticated users can access their own tasks.
    """
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Filter tasks to only return tasks owned by the authenticated user.
        IsAuthenticated permission ensures user is authenticated.
        """
        return Task.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        """
        Set the owner of the task to the authenticated user when creating.
        This is the only perform_* method we need to override.
        """
        serializer.save(owner=self.request.user)
