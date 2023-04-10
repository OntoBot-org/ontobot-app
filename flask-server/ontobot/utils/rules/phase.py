import json
from ontobot.utils import onto

with open('ontobot/model/Grammar.json') as user_file:
    rule_contents = user_file.read()

rule_json = json.loads(rule_contents)

class Phase:
    __checked_d_list = []
    __checked_sub_phase_concept_list = []
    __taxonomy_list = []
    __phase_list = []
    __phase_onto = {}
    __phase_warning_list = []

    def __init__(self, arr):
        self.__phase_list.clear()
        self.__checked_d_list.clear()
        self.__checked_sub_phase_concept_list.clear()
        self.__phase_warning_list.clear()
        self.__phase_onto = onto.Taxonomy()
        self.__taxonomy_list = self.__phase_onto.get_stack(arr['subclasses'])

    def __check_phase(self):
        super_class = {}
        for index in range(len(self.__taxonomy_list) - 1):
            current_item = self.__taxonomy_list[index]
            next_item = self.__taxonomy_list[index + 1]

            if current_item['level'] < next_item['level']:
                super_class = current_item

            if (current_item['level'] > next_item['level']) or (current_item['level'] == 0 and next_item['level'] == 0):
                continue

            sortal_expression = rule_json['ontoUML']['sortaluniversal']
            if super_class['stereotype'] in sortal_expression:
                is_parent_valid = True
            else:
                is_parent_valid = False

            if current_item['class_name'] in self.__phase_list and next_item['class_name'] in self.__phase_list:
                continue

            if ('disjoint' in super_class) and len(super_class['disjoint']) > 0:
                d_classes_list:list = []
                d_classes_list = super_class['disjoint']
                for d_classes in d_classes_list:
                    result = self.__phase_onto.get_selected_concepts(d_classes, 'phase')
                    if is_parent_valid and len(result) >= 2:
                        if super_class['class_name'] not in self.__phase_list:
                            self.__phase_list.append(super_class['class_name'])

                        for concept in result:
                            if concept['class_name'] not in self.__phase_list:
                                self.__phase_list.append(concept['class_name'])
                    
                    # add warning message since one pattern violation of a class/concept could be override by another pattern satisfaction
                    if is_parent_valid and len(result) > 0 and len(result) != len(d_classes) and not self.__is_already_checked_dlist(dclass_list=d_classes):
                        set1 = set(d_classes)
                        set2 = set(map(lambda x: x["class_name"], result))
                        invalid_phase_set = set1 - set2
                        self.__phase_warning_list.append({
                            "topic" : "Phase Pattern Warning",
                            "msg" : f"{list(invalid_phase_set)} must be phase and disjoint each other completely"
                        })
                    
                        self.__checked_d_list.append(d_classes)
            
            else: 
                # check if user has added phase concept though he hasn't define disjoint property
                if next_item['stereotype'] == 'phase' and not self.__is_already_checked_isolated_phase_concept:
                    self.__phase_warning_list.append({
                            "topic" : "Phase Pattern Warning",
                            "msg" : f"Since {next_item['class_name']} is phase stereotype, there must be phase sibling/s for this concept with disjoint complete property"
                        })
                    self.__checked_sub_phase_concept_list.append(next_item['class_name'])
                    
                
    
    def __is_already_checked_dlist(self, dclass_list):
        for list in self.__checked_d_list:
            if list == dclass_list:
                return True
        return False
    
    def __is_already_checked_isolated_phase_concept(self, concept):
        for phase_concept in self.__checked_sub_phase_concept_list:
            if phase_concept == concept:
                return True
        
        return False

    def get_phase_list(self):
        self.__check_phase()
        return self.__phase_list
    
    def get_phase_warn_list(self):
        return self.__phase_warning_list