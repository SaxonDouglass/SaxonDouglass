from django.conf.urls import patterns, include, url

urlpatterns = patterns('github.views',
    url(r'^post-receive$', 'post_receive'),
)
