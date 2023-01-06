import json

from ontobot.utils import onto

with open("ontobot/model/Grammar.json") as user_file:
    rule_contents = user_file.read()

rule_json = json.loads(rule_contents)


class Subkind:
    __taxonomy_list = []
    __subkind_list = []
    __subkind_onto = {}

    def __init__(self, arr):
        self.__subkind_list.clear()
        self.__subkind_onto = onto.Taxonomy()
        self.__taxonomy_list = self.__subkind_onto.get_stack(arr['subclasses'])

    def __check_subkind(self):
        super_class = {}
        for index in range(len(self.__taxonomy_list) - 1):
            current_item = self.__taxonomy_list[index]
            next_item = self.__taxonomy_list[index + 1]

            if current_item['level'] < next_item['level']:
                super_class = current_item

            if (current_item['level'] == 0 and next_item['level'] == 0) or next_item['level'] == 0:
                continue

            if current_item['level'] > next_item['level']:
                super_class = self.__subkind_onto.find_super_class(next_item, index)

            rigid_sortal = rule_json['ontoUML']['rigidsortal']
            if super_class['stereotype'] in rigid_sortal:
                is_parent_valid = True
            else:
                is_parent_valid = False

            if current_item['class_name'] in self.__subkind_list and next_item['class_name'] in self.__subkind_list:
                continue

            # variant 01
            if ('disjoint' in current_item) and len(current_item['disjoint']) == 0:
                sub_class = next_item
                is_disjoint_complete = self.__subkind_onto.is_disjoint_complete(super_class, sub_class)
                if (sub_class['stereotype'] == 'subkind') and is_parent_valid and not is_disjoint_complete:
                    if super_class['class_name'] not in self.__subkind_list:
                        self.__subkind_list.append(super_class['class_name'])
                    if sub_class['class_name'] not in self.__subkind_list:
                        self.__subkind_list.append(sub_class['class_name'])

            # variant 02
            else:
                d_classes_list:list = []
                d_classes_list = current_item['disjoint']
                for d_classes in d_classes_list:
                    result = self.__subkind_onto.get_selected_concepts(d_classes, 'subkind')
                    if is_parent_valid and len(result) >= 2:
                        if super_class['class_name'] not in self.__subkind_list:
                            self.__subkind_list.append(super_class['class_name'])

                        for concept in result:
                            if concept['class_name'] not in self.__subkind_list:
                                self.__subkind_list.append(concept['class_name'])
                
                
                

    def get_subkind_list(self):
        self.__check_subkind()
        return self.__subkind_list