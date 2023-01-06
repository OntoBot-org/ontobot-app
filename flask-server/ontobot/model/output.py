import json

class Error:
    @staticmethod
    def send_taxonomy_error(concept_list):
        mismatched_concepts = concept_list
        topic = "Some concepts are not matched with ontoUML grammar"
        message = ['If the concept is a super concept (level = 0 or level > 0), please check the stereotype',
         'If the concept is a sub concept (level > 0) and it does not have siblings, please check the stereotype',
         'If the concept is a sub concept (level > 0) and it has siblings (same-level concepts), please check the stereotype and disjoint property']

        err = {
            "concepts" : mismatched_concepts,
            "topic": topic,
            "msg": message,
            "type": 'error',
            "code": 500
        }

        return json.dumps(err)

    @staticmethod
    def send_something_went_wrong_error(msg):
        err = {
            "code": '500',
            "topic": 'Something went wrong',
            "type": 'error',
            "msg": str(msg)
        }

        return json.dumps(err)


class Response:
    @staticmethod
    def send_response(msg):
        response = {
            "code": 201,
            "msg": msg,
            "type": 'success'
        }

        return json.dumps(response)