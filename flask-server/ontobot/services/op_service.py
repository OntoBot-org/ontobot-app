from ontobot.utils.onto import OP
from ontobot.utils.rules import nary
from ontobot.model.output import Error,Response
from ontobot.utils.rules import custom
from ontobot.utils.rules import role
from ontobot.utils.rules import collective
from ontobot.services import firestore_connect
from ontobot.utils import cmethod

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

        if db_taxonomy_result is not None:
            invalid_custom_concepts = custom.get_relational_pattern(db_taxonomy_result['msg'], relationship_list) # check relational pattern
            invalid_role_concepts = role.get_role_pattern(db_taxonomy_result['msg'], op_struct) # check role pattern
            invalid_collective_concepts_stage_01 = collective.get_collective_pattern_stage_01(db_taxonomy_result['msg'], op_struct) # check collective pattern
            invalid_collective_concepts_stage_02 = collective.get_collective_pattern_stage_02(op_struct) # check collective pattern

            if len(invalid_custom_concepts) > 0:
                return Error.next(err=invalid_custom_concepts, type="op_relational")
            
            if len(invalid_role_concepts) > 0:
                return Error.next(err=invalid_role_concepts, type="role")
            
            if len(invalid_collective_concepts_stage_01) > 0:
                return Error.next(err=invalid_collective_concepts_stage_01, type="collective-01")
            
            if len(invalid_collective_concepts_stage_02) > 0:
                return Error.next(err=invalid_collective_concepts_stage_02, type="collective-02")

            # get n-ary pattern
            db_owlTaxonomy_result = firestore_connect.get_OwlTaxo_document(session_id=sessionID)
            final_op_result = nary.get_nary_structure(op_struct, db_owlTaxonomy_result['concepts'], sessionID)

            relationships = []
            for op in final_op_result:
                relationships.append(op['op_name'])
                if len(op["op_equal"]) > 0:
                    relationships.append(op['op_equal'])

            owl_complete = {
                "sessionID" : sessionID,
                "taxonomy" : db_owlTaxonomy_result['taxonomy'],
                "concepts" : db_owlTaxonomy_result['concepts'],
                "op" : final_op_result,
                "relationships" : list(set(relationships))
            }

            firestore_connect.create_new_owlComplete_document(session_id=sessionID, obj=owl_complete)
            return Response.next(cmethod.convertFromTaxonomyContent(owl_complete))
        
        else:
            return Error.next(err="No session data is found", type="sww")
    
    except Exception as err:
        return Error.next(err=err, type="sww")



def test_data_structure(parsed_json):
    op = OP()
    relationship_list = parsed_json['subrelationships']
    op_struct = op.get_stack(relationship_list)
    return Response.send_response(op_struct)