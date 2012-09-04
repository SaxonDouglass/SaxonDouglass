from django.conf.urls import patterns, include, url

urlpatterns = patterns('games.views',
    url(r'^$', 'index'),
    url(r'^(?P<game_slug>[\w-]+)/$', 'detail'),
)
