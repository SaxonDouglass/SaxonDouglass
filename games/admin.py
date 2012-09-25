from django.contrib import admin
from models import *

class DownloadAdmin(admin.ModelAdmin):
    def save_model(self, request, obj, form, change):
        #Remove the previous file if the object is not new 
        #and new file supplied.
        if obj.pk != None and len(request.FILES) > 0:
            try:
                import os
                old_obj = Download.objects.get(pk = obj.pk)
                if old_obj.file:
                    old_path = old_obj.file.path
                    os.remove(old_path)
            except Download.DoesNotExist:
                pass
        obj.save()
admin.site.register(Download, DownloadAdmin)

class DownloadInline(admin.TabularInline):
    model = Download

class GameAdmin(admin.ModelAdmin):
    inlines = [
        DownloadInline,
    ]
    def save_model(self, request, obj, form, change):
        #Remove the previous file if the object is not new 
        #and new file supplied.
        if obj.pk != None and len(request.FILES) > 0:
            try:
                import os
                old_obj = Game.objects.get(pk = obj.pk)
                old_path = old_obj.image.path
                os.remove(old_path)
            except Game.DoesNotExist:
                pass
        obj.save()
admin.site.register(Game, GameAdmin)
