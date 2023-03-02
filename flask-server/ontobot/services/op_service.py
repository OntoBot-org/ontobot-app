from ontobot.utils.onto import OP
from ontobot.utils.rules import nary
from ontobot.model.output import Error,Response
from ontobot.utils.rules import custom
from ontobot.utils.rules import role
from ontobot.services import firestore_connect

# from ontobot.db.taxonomy import Taxonomy


def get_op_structure(parsed_json):
    op = OP()
    # taxonomy_obj = Taxonomy() 
    sessionID = parsed_json['sessionID']

    try:
        relationship_list = parsed_json['subrelationships']
        op_struct = op.get_stack(relationship_list)
        # taxonomy_result = taxonomy_obj.taxonomy_result # get taxonomy result from the db
        db_taxonomy_result=firestore_connect.get_document(session_id=sessionID)
        invalid_custom_concepts = custom.get_relational_pattern(db_taxonomy_result['msg'], relationship_list) # check relational pattern
        invalid_role_concepts = role.get_role_pattern(db_taxonomy_result['msg'], op_struct) # check role pattern
        
        if len(invalid_custom_concepts) > 0:
           return Error.send_op_relational_error(invalid_custom_concepts)
        
        if len(invalid_role_concepts) > 0:
            return Error.send_role_error(invalid_role_concepts)

        # get n-ary pattern
        # return Response.send_response(nary.get_nary_structure(op_struct))
        return Response.send_response(db_taxonomy_result['msg'])
    except Exception as err:
        return Error.send_something_went_wrong_error(err)


    