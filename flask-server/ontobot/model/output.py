import json
from ontobot.utils.umle import UMLE

class Error:
    @staticmethod
    def send_taxonomy_error(concept_list, taxomomy_list):
        mismatched_concepts = concept_list
        topic = "Some concepts are not matched with ontoUML grammar"
        message = ['If the concept is a super concept (level = 0 or level > 0), please check the stereotype',
         'If the concept is a sub concept (level > 0) and it does not have siblings, please check the stereotype',
         'If the concept is a sub concept (level > 0) and it has siblings (same-level concepts), please check the stereotype and disjoint property']

        umle = UMLE(taxomomy_list, concept_list)
        umle.check_zero_level()
        umle.check_phase_level()
        umle.check_category_level()

        err = {
            "concepts" : mismatched_concepts,
            "topic": topic,
            "msg": message,
            "meta": list(umle.get_err_list()),
            "type": 'error',
            "code": 500
        }

        return json.dumps(err)

    @staticmethod
    def send_something_went_wrong_error(msg):
        err = {
            "code": 500,
            "topic": 'Something went wrong',
            "type": 'error',
            "msg": str(msg)
        }

        return json.dumps(err)

    @staticmethod
    def send_op_relational_error(concept_list):
        err = {
            "code" : 500,
            "topic" : "Relational pattern violation",
            "msg" : concept_list
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