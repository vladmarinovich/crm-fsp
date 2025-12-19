from django.db import models

class TimeStampedModel(models.Model):
    """
    Una clase base abstracta que proporciona campos autoadministrados
    de creación y modificación.
    """
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    last_modified_at = models.DateTimeField(auto_now=True, null=True, blank=True)

    class Meta:
        abstract = True
