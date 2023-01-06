
from ontobot.model.output import Error,Response
from ontobot.utils.rules.subkind import Subkind
from ontobot.utils.rules.custom import Custom
from ontobot.utils.rules.phase import Phase
from ontobot.utils.rules.rolemixin import RMixin
from ontobot.utils.rules.category import Category
from ontobot.utils.owl import OWL
from ontobot.services import factory


def validate_taxonomy_service(parsed_json):
    try:
        valid_concept = []
        all_concepts = []
        owl = OWL(parsed_json)

        # get all concepts into a set
        all_concepts = owl.get_taxonomy_concepts()

        subkind_pattern: Subkind = factory.ODPFactory.get_ontouml_odp(
            'subkind', parsed_json)
        custom_pattern: Custom = factory.ODPFactory.get_ontouml_odp(
            'custom', parsed_json)
        phase_pattern: Phase = factory.ODPFactory.get_ontouml_odp(
            'phase', parsed_json)
        rolemixin_pattern: RMixin = factory.ODPFactory.get_ontouml_odp(
            'rolemixin', parsed_json)
        category_pattern : Category = factory.ODPFactory.get_ontouml_odp(
            'category', parsed_json)

        # identify valid concepts
        valid_concept.extend(subkind_pattern.get_subkind_list())
        valid_concept.extend(phase_pattern.get_phase_list()) 
        valid_concept.extend(custom_pattern.get_custom_list())
        valid_concept.extend(rolemixin_pattern.get_rolemixin_list())
        valid_concept.extend(category_pattern.get_category_list()) 
        

        # convirt valid_consept list into set
        valid_concept = set(valid_concept)

        if valid_concept == all_concepts:
            return Response.send_response("can proceed further")
        else:
            set_difference = all_concepts - valid_concept
            return Error.send_taxonomy_error(list(set_difference))

    except Exception as err:
        return err.with_traceback()


def get_taxonomy_owl(parsed_json):
    try:
        if len(parsed_json) == 0:
            raise Exception('data array is empty')
        
        owl = OWL(parsed_json)
        return Response.send_response(owl.get_taxonomy_json())

    except Exception as err:
        return Error.send_something_went_wrong_error(err)
