from django.db import models

class Game(models.Model):
    title = models.CharField(max_length=20)
    slug = models.SlugField(max_length=20)
    date = models.DateField()
    brief = models.TextField()
    details = models.TextField()
    image = models.ImageField(upload_to=lambda instance, filename: 'img/game/'+instance.slug+'-badge')

    def __unicode__(self):
        return self.title

class Download(models.Model):
    label = models.CharField(max_length=20)
    sublabel = models.CharField(max_length=20,blank=True,null=True)
    game = models.ForeignKey(Game)
    link = models.CharField(max_length=128,blank=True,null=True)
    file = models.FileField(upload_to=lambda instance, filename: 'game/'+instance.game.slug+'/'+filename,blank=True,null=True)
    url = models.CharField(max_length=128,editable=False)
    
    def save(self):
        super(Download, self).save()
        if self.link:
            self.url = self.link
        elif self.file:
            self.url = self.file.url
        else:
            self.url = ''
        super(Download, self).save()

    def __unicode__(self):
        return self.game.title+' - '+self.label+' (' + self.sublabel + ')'
