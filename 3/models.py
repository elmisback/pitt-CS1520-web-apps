import json
from google.appengine.ext import ndb

class Note(ndb.Model):
    text = ndb.StringProperty()
    title = ndb.StringProperty()
    date = ndb.StringProperty()
    user_email = ndb.StringProperty()

    @staticmethod
    def formatted(note):
        return {'user_email': note.user_email,
                'title': note.title,
                'noteId': note.key.urlsafe(),
                'date': note.date,
                'text': note.text}
