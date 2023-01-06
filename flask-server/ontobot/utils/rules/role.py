import json

from ontobot.utils import onto

with open('ontobot/model/Grammar.json') as user_file:
    rule_contents = user_file.read()

rule_json = json.loads(rule_contents)


class Role:
    __taxonomy_list = []
    __op_list = []
    __role_onto = onto.Taxonomy()
    __role_op = onto.OP()
    __role_list = []

    def __init__(self, arr):
        self.__taxonomy_list = self.__role_onto.get_stack(arr['subclasses'])
        self.__op_list = self.__role_op.get_stack(arr['op'])

    def __check_role(self):
        super_class = {}
        for index in range(len(self.__taxonomy_list) - 1):
            current_item = self.__taxonomy_list[index]
            next_item = self.__taxonomy_list[index + 1]

            if current_item['level'] < next_item['level']:
                super_class = current_item

            if (current_item['level'] == 0 and next_item['level'] == 0) or next_item['level'] == 0:
                continue

            if current_item['level'] > next_item['level']:
                super_class = self.__role_onto.find_super_class(next_item, index)

            sortal_expression = rule_json['ontoUML']['sortaluniversal']
            if super_class['stereotype'] in sortal_expression:
                is_parent_valid = True
            else:
                is_parent_valid = False

            if current_item['class_name'] in self.__role_list and next_item['class_name'] in self.__role_list:
                continue

            if is_parent_valid:
                sub_class = next_item
                if sub_class['stereotype'] == 'role' and self.__role_op.has_object_property(sub_class):
                    if super_class['class_name'] not in self.__role_list:
                        self.__role_list.append(super_class['class_name'])
                    if sub_class['class_name'] not in self.__role_list:
                        self.__role_list.append(sub_class['class_name'])

    def get_role_list(self):
        self.__check_role()
        return self.__role_list