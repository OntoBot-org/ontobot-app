import json

from ontobot.utils import onto
from ontobot.utils import cmethod

with open('ontobot/model/Grammar.json') as user_file:
    rule_contents = user_file.read()

rule_json = json.loads(rule_contents)


class Custom:
    __taxonomy_list = []
    __custom_onto = {}
    __custom_list = []

    def __init__(self, arr):
        self.__custom_list.clear()
        self.__custom_onto = onto.Taxonomy()
        self.__taxonomy_list = self.__custom_onto.get_stack(arr['subclasses'])

    def __check_custom(self):
        for index in range(len(self.__taxonomy_list)):
            current_item = self.__taxonomy_list[index]
            if current_item['level'] == 0 and current_item['cardinality'] == 0:
                if len(current_item['stereotype']) > 0 and current_item['stereotype'] != 'subkind':
                    self.__custom_list.append(current_item['class_name'])

    def get_custom_list(self):
        self.__check_custom()
        return self.__custom_list


# custom pattern 01 - Qualitative & Quantitative pattern
def get_qq_pattern(parsed_json, taxonomy_result):
    parsed_json_copy = parsed_json
    taxonomy_result_copy = taxonomy_result
    invalid_concepts = []; invalid_concepts.clear()

    for concept in taxonomy_result_copy:
        if concept['level'] == 0 and len(concept['attributes']) == 0:
            invalid_concepts.append(concept['class_name'])
    
    if len(invalid_concepts) == 0:
        return parsed_json
    else:
        # parsed_json_taxonomy = parsed_json_copy['subclasses']
        for invalid_concept in invalid_concepts:
            for concept in parsed_json_copy['subclasses']:
                if concept['name'] == invalid_concept:
                    id = 0
                    concept['propertiesList'].extend([
                        {
                            "id": str(id),
                            "name": "ID",
                            "datatype": "int",
                            "restrictions": "non zero",
                            "functional": True
                        },
                        {
                            "id": str(id + 1),
                            "name": invalid_concept+" name",
                            "datatype": "string",
                            "restrictions": "not null",
                            "functional": True
                        }
                    ])  
        
        return parsed_json_copy

# custom pattern 02 - Relational Pattern
# This pattern check wether there is any isolated class/es without having at least one relationship
def get_relational_pattern(taxonomy_result, relationship_list):
    list = cmethod.get_relational_diverse_concept_list(taxonomy_result, relationship_list)
    return list