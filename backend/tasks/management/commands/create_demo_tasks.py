from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from tasks.models import Task
from datetime import date, timedelta
import random


class Command(BaseCommand):
    help = 'Create demo tasks for a user (similar to Laravel factories)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--username',
            type=str,
            help='Username to create tasks for (defaults to first user if not specified)',
        )
        parser.add_argument(
            '--count',
            type=int,
            default=10,
            help='Number of tasks to create (default: 10)',
        )

    def handle(self, *args, **options):
        username = options.get('username')
        count = options.get('count', 10)

        # Get or find user
        if username:
            try:
                user = User.objects.get(username=username)
            except User.DoesNotExist:
                self.stdout.write(
                    self.style.ERROR(f'User "{username}" does not exist.')
                )
                return
        else:
            # Get first user, or create a demo user if none exists
            user = User.objects.first()
            if not user:
                self.stdout.write(
                    self.style.WARNING(
                        'No users found. Creating a demo user...')
                )
                user = User.objects.create_user(
                    username='demo',
                    email='demo@example.com',
                    password='demo123',
                    first_name='Demo',
                    last_name='User'
                )
                self.stdout.write(
                    self.style.SUCCESS(f'Created demo user: {user.username}')
                )

        # Task templates with realistic data
        task_templates = [
            {
                'title': 'Review project documentation',
                'description': 'Go through the project README and update any outdated information',
                'status': 'TODO',
                'priority': 'MEDIUM',
                'deadline_days': 7
            },
            {
                'title': 'Implement user authentication',
                'description': 'Add JWT token refresh functionality and improve error handling',
                'status': 'DOING',
                'priority': 'HIGH',
                'deadline_days': 3
            },
            {
                'title': 'Write unit tests for API endpoints',
                'description': 'Create comprehensive test coverage for all task-related endpoints',
                'status': 'TODO',
                'priority': 'HIGH',
                'deadline_days': 14
            },
            {
                'title': 'Design database schema improvements',
                'description': 'Review current schema and propose optimizations for better performance',
                'status': 'DOING',
                'priority': 'LOW',
                'deadline_days': 21
            },
            {
                'title': 'Set up CI/CD pipeline',
                'description': 'Configure GitHub Actions for automated testing and deployment',
                'status': 'TODO',
                'priority': 'MEDIUM',
                'deadline_days': 10
            },
            {
                'title': 'Fix bug in task filtering',
                'description': 'Users are seeing tasks from other users, need to fix the filter query',
                'status': 'DOING',
                'priority': 'HIGH',
                'deadline_days': 1
            },
            {
                'title': 'Update frontend dependencies',
                'description': 'Review and update npm packages to latest stable versions',
                'status': 'DONE',
                'priority': 'LOW',
                'deadline_days': -5
            },
            {
                'title': 'Create API documentation',
                'description': 'Write comprehensive API documentation using Swagger/OpenAPI',
                'status': 'TODO',
                'priority': 'MEDIUM',
                'deadline_days': 12
            },
            {
                'title': 'Optimize database queries',
                'description': 'Add database indexes and optimize slow queries identified in production',
                'status': 'DOING',
                'priority': 'HIGH',
                'deadline_days': 5
            },
            {
                'title': 'Add task categories feature',
                'description': 'Implement ability to categorize tasks with tags or labels',
                'status': 'TODO',
                'priority': 'LOW',
                'deadline_days': 30
            },
            {
                'title': 'Implement task search functionality',
                'description': 'Add search and filter capabilities to the tasks list',
                'status': 'TODO',
                'priority': 'MEDIUM',
                'deadline_days': 8
            },
            {
                'title': 'Refactor authentication middleware',
                'description': 'Improve code organization and error handling in auth middleware',
                'status': 'DONE',
                'priority': 'MEDIUM',
                'deadline_days': -2
            },
            {
                'title': 'Add email notifications',
                'description': 'Send email notifications when tasks are assigned or deadlines approach',
                'status': 'TODO',
                'priority': 'LOW',
                'deadline_days': 20
            },
            {
                'title': 'Create user dashboard',
                'description': 'Build a dashboard showing task statistics and recent activity',
                'status': 'DOING',
                'priority': 'MEDIUM',
                'deadline_days': 15
            },
            {
                'title': 'Write integration tests',
                'description': 'Create end-to-end tests for the complete task workflow',
                'status': 'TODO',
                'priority': 'HIGH',
                'deadline_days': 6
            },
        ]

        # Create tasks
        created_count = 0
        for i in range(count):
            # Cycle through templates or use random ones
            template = task_templates[i % len(task_templates)]

            # Add some variation to make tasks unique
            title = template['title']
            if i >= len(task_templates):
                title = f"{template['title']} ({i + 1})"

            deadline = None
            if template.get('deadline_days') is not None:
                deadline = date.today() + \
                    timedelta(days=template['deadline_days'])

            task = Task.objects.create(
                title=title,
                description=template['description'],
                status=template['status'],
                priority=template['priority'],
                deadline=deadline,
                owner=user
            )
            created_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {created_count} demo tasks for user "{user.username}"'
            )
        )
