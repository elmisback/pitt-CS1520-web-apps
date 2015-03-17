import os
import logging
from webapp2 import RequestHandler, WSGIApplication

from google.appengine.ext.webapp import template

def render_template(handler, template_name, template_values):
    path = os.path.join(os.path.dirname(__file__), 'templates/' + template_name)
    html = template.render(path, template_values)
    handler.response.out.write(html)

class ProcessForm(RequestHandler):
    def post(self):
        op_0 = self.request.get('operand_0')
        op_1 = self.request.get('operand_1')
        operator = self.request.get('operator')
        # avoid eval() because executing arbitrary POST requests from the 
        # interwebz would probably put us in the DANGER ZONE
        op_d = {'+':float.__add__, '-':float.__sub__, '*':float.__mul__, 
                '/':float.__div__}
        try:
            result = op_d[operator] (float(op_0), float(op_1)) 
            if int(result) == result:
                result = int(result)
        except Exception as e:
            logging.info('Bad value entered, exception caught:\n{}'.format(e))
            logging.info('\nValues entered:\nop_0:{}\noperator:{}\nop_1:{}'
                            .format(op_0, operator, op_1))
            result = 'undefined'
        render_template(self, 'formresult.html', 
                        {'op_0':op_0, 'op_1':op_1, 
                         'operator':operator, 'result':result})

class MainPage(RequestHandler):
    def get(self):
        render_template(self, 'index.html', None)

app = WSGIApplication([
    ('/', MainPage), 
    ('/processform', ProcessForm)
    ], debug=True)
