from django.template import RequestContext
from django.shortcuts import render_to_response, get_object_or_404
from models import *

def index(request):
    gl = Game.objects.all().order_by('-date')
    return render_to_response('games/index.html', {'game_list': gl}, context_instance=RequestContext(request))

def detail(request, game_slug):
    g = get_object_or_404(Game, slug=game_slug)
    d = Download.objects.filter(game=g)
    return render_to_response('games/detail.html', {'game': g, 'download_list': d}, context_instance=RequestContext(request))
