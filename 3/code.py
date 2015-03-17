from webapp2 import RequestHandler, WSGIApplication
from google.appengine.api import users

from models import Note
import logging
import json

from google.appengine.ext import ndb

class Save(RequestHandler):
    def post(self):
        user = users.get_current_user()
        update = json.loads(self.request.body)
        k = ndb.Key(urlsafe=update['noteId'])
        note = k.get()
        assert(note.user_email == user.email())
        note.text = update['text']
        note.title = update['title']
        note.date = update['date']
        note.put()

class Add(RequestHandler):
    def post(self):
        user = users.get_current_user()
        note = Note(user_email=user.email(), text='', title='')
        k = note.put()
        return self.response.out.write(json.dumps(Note.formatted(note)))

class Index(RequestHandler):
    def post(self):
        user = users.get_current_user()
        notes = [Note.formatted(note)
                 for note in Note.query(Note.user_email==user.email())]
        return self.response.out.write(json.dumps(notes))

class Delete(RequestHandler):
    def post(self):
        user = users.get_current_user()
        note = json.loads(self.request.body)
        k = ndb.Key(urlsafe=note['noteId'])
        k.delete()

class Logout(RequestHandler):
    def post(self):
        return self.response.out.write(json.dumps(
            {'logout_url': users.create_logout_url('/')}))

app = WSGIApplication([
    ('/server/save', Save),
    ('/server/add', Add),
    ('/server/index', Index),
    ('/server/delete', Delete),
    ('/server/logout', Logout),
    ], debug=True)
