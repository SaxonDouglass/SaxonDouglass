from django.contrib import admin
from models import *

class DownloadAdmin(admin.ModelAdmin):
    pass
admin.site.register(Download, DownloadAdmin)

class DownloadInline(admin.TabularInline):
    model = Download

class GameAdmin(admin.ModelAdmin):
    inlines = [
        DownloadInline,
    ]
admin.site.register(Game, GameAdmin)
