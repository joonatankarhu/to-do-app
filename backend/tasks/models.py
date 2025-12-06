from django.db import models

# Create your models here.


class Task(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(
        max_length=10,
        choices=[('TODO', 'TODO'), ('DOING', 'DOING'), ('DONE', 'DONE')])
    priority = models.CharField(
        max_length=10,
        choices=[('LOW', 'LOW'), ('MEDIUM', 'MEDIUM'), ('HIGH', 'HIGH')])
    deadline = models.DateField(blank=True, null=True)
    owner = models.ForeignKey(
        'auth.User', related_name='tasks', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
