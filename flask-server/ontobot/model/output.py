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
        umle.check_subkind_level()
        umle.check_rolemixin_level()

        err = {
            "topic": topic,
            "msg": {
                "concepts" : mismatched_concepts,
                "content" : message
            },
            "meta": list(umle.get_err_list()),
            "type": 'error',
            "code": 500
        }

        return json.dumps(err)
    
    @staticmethod
    def send_taxonomy_warn(warn_list):
        warn = {
            "topic" : "Some concepts are biased to violate the ontoUML grammar",
            "msg" : {
                "concepts" : "Concepts are described in the message",
                "content" : "Try to solve the warning issues for getting a quality ontology"
            },
            "meta" : warn_list,
            "type": 'warning',
            "code": 500
        }

        return json.dumps(warn)

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
            "msg" : "Following concepts should have connected with object property",
            "meta" : concept_list,
            "type" : "error"
        }

        return json.dumps(err)
    
    @staticmethod
    def send_role_error(concept_list):
        err = {
            "code" : 500,
            "topic" : "Role pattern violation",
            "msg" : "Following concepts should have connected with object property",
            "meta" : concept_list,
            "type" : "error"
        }

        return json.dumps(err)
    
    @staticmethod
    def send_collective_error(concept_list, stage):
        if stage == 1:
            err = {
            "code" : 500,
            "topic" : "Collective pattern violation",
            "msg" : "Following concepts should be with collective stereotypes",
            "meta" : concept_list,
            "type" : "error"
        }
        else:
            err = {
            "code" : 500,
            "topic" : "Collective pattern violation",
            "msg" : "The min values of the Object Properties associated with following ranges/concepts should be at least 2",
            "meta" : concept_list,
            "type" : "error"
        }

        return json.dumps(err)
    
    @staticmethod
    def file_error(msg):
        err = {
            "code" : 400,
            "topic" : "File Error",
            "msg" : msg,
            "type": "error"
        }

        return json.dumps(err)
    
    
    @staticmethod
    def next(err, type=None):
        return {
            "code": 500,
            "msg": err,
            "type": type
        }


class Response:
    @staticmethod
    def send_response(msg):
        response = {
            "code": 201,
            "msg": msg,
            "type": 'success'
        }

        return json.dumps(response)
    
    @staticmethod
    def next(msg):
        return {
            "code" : 201,
            "msg" : msg
        }