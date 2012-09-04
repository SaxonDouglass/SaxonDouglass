import subprocess
from django.http import HttpResponse, HttpResponseNotFound

def post_receive(request):
    if request.method == 'POST':
        post = request.POST
        if post.commits.ref == 'refs/heads/master':
            subprocess.call(['github/post_receive.sh'])
    return HttpResponse('')
