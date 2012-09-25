# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Game'
        db.create_table('games_game', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('title', self.gf('django.db.models.fields.CharField')(max_length=20)),
            ('slug', self.gf('django.db.models.fields.SlugField')(max_length=20)),
            ('brief', self.gf('django.db.models.fields.TextField')()),
            ('details', self.gf('django.db.models.fields.TextField')()),
            ('image', self.gf('django.db.models.fields.files.ImageField')(max_length=100)),
        ))
        db.send_create_signal('games', ['Game'])

        # Adding model 'Download'
        db.create_table('games_download', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('label', self.gf('django.db.models.fields.CharField')(max_length=20)),
            ('sublabel', self.gf('django.db.models.fields.CharField')(max_length=20, null=True, blank=True)),
            ('game', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['games.Game'])),
            ('link', self.gf('django.db.models.fields.CharField')(max_length=128, null=True, blank=True)),
            ('file', self.gf('django.db.models.fields.files.FileField')(max_length=100, null=True, blank=True)),
            ('url', self.gf('django.db.models.fields.CharField')(max_length=128)),
        ))
        db.send_create_signal('games', ['Download'])


    def backwards(self, orm):
        # Deleting model 'Game'
        db.delete_table('games_game')

        # Deleting model 'Download'
        db.delete_table('games_download')


    models = {
        'games.download': {
            'Meta': {'object_name': 'Download'},
            'file': ('django.db.models.fields.files.FileField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'game': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['games.Game']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'label': ('django.db.models.fields.CharField', [], {'max_length': '20'}),
            'link': ('django.db.models.fields.CharField', [], {'max_length': '128', 'null': 'True', 'blank': 'True'}),
            'sublabel': ('django.db.models.fields.CharField', [], {'max_length': '20', 'null': 'True', 'blank': 'True'}),
            'url': ('django.db.models.fields.CharField', [], {'max_length': '128'})
        },
        'games.game': {
            'Meta': {'object_name': 'Game'},
            'brief': ('django.db.models.fields.TextField', [], {}),
            'details': ('django.db.models.fields.TextField', [], {}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'image': ('django.db.models.fields.files.ImageField', [], {'max_length': '100'}),
            'slug': ('django.db.models.fields.SlugField', [], {'max_length': '20'}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '20'})
        }
    }

    complete_apps = ['games']