from ontobot.utils.onto import OP
from ontobot.utils.rules import nary
from ontobot.model.output import Error,Response
from ontobot.utils.rules import custom

from ontobot.db.taxonomy import Taxonomy


def get_op_structure(parsed_json):
    op = OP()
    taxonomy_obj = Taxonomy() 
    try:
        relationship_list = parsed_json['subrelationships']
        op_struct = op.get_stack(relationship_list)
        taxonomy_result = taxonomy_obj.taxonomy_result # get taxonomy result from the db
        invalid_concepts = custom.get_relational_pattern(taxonomy_result, relationship_list) # check relational pattern
        if len(invalid_concepts) > 0:
           return Error.send_op_relational_error(invalid_concepts)

        # get n-ary pattern
        return Response.send_response(nary.get_nary_structure(op_struct))
    except Exception as err:
        return Error.send_something_went_wrong_error(err)


    