import json

from ontobot.utils import onto

with open('ontobot/model/Grammar.json') as user_file:
    rule_contents = user_file.read()

rule_json = json.loads(rule_contents)


class Phase:
    __taxonomy_list = []
    __phase_list = []
    __phase_onto = {}

    def __init__(self, arr):
        self.__phase_list.clear()
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

            if ('disjoint' in current_item) and len(current_item['disjoint']) > 0:
                d_classes_list:list = []
                d_classes_list = current_item['disjoint']
                for d_classes in d_classes_list:
                    result = self.__phase_onto.get_selected_concepts(d_classes, 'phase')
                    if is_parent_valid and len(result) >= 2:
                        if super_class['class_name'] not in self.__phase_list:
                            self.__phase_list.append(super_class['class_name'])

                        for concept in result:
                            if concept['class_name'] not in self.__phase_list:
                                self.__phase_list.append(concept['class_name'])
                

    def get_phase_list(self):
        self.__check_phase()
        return self.__phase_list