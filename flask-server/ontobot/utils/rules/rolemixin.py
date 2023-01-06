import json

from ontobot.utils import onto

with open('ontobot/model/Grammar.json') as user_file:
    rule_contents = user_file.read()

rule_json = json.loads(rule_contents)


class RMixin:
    __taxonomy_list = []
    __mixin_list = []
    __mixin_onto = {}

    def __init__(self, arr):
        self.__mixin_onto = onto.Taxonomy()
        self.__taxonomy_list = self.__mixin_onto.get_stack(arr['subclasses'])
        self.__mixin_list.clear()

    def __check_rolemixin(self):
        super_class = {}
        for index in range(len(self.__taxonomy_list) - 1):
            current_item = self.__taxonomy_list[index]
            next_item = self.__taxonomy_list[index + 1]

            if current_item['level'] < next_item['level']:
                super_class = current_item

            if (current_item['level'] == 0 and next_item['level'] == 0) or next_item['level'] == 0:
                continue

            if current_item['class_name'] in self.__mixin_list and next_item['class_name'] in self.__mixin_list:
                continue

            if current_item['level'] > next_item['level']:
                super_class = self.__mixin_onto.find_super_class(next_item, index)

            # variants : superclasses is rolemixin
            if super_class['stereotype'] == 'rolemixin':
                is_parent_mixin_valid = True
                is_parent_sortal_valid = False
            elif super_class['stereotype'] in rule_json['ontoUML']['sortaluniversal']:
                is_parent_sortal_valid = True
                is_parent_mixin_valid = False
            else:
                is_parent_mixin_valid = False
                is_parent_sortal_valid = False

            # one parent should be satisfied to go further
            if not is_parent_mixin_valid and not is_parent_sortal_valid:
                continue

            # version 02
            if is_parent_mixin_valid:
                if ('disjoint' in current_item) and len(current_item['disjoint']) > 0:
                    d_classes_list:list = []
                    d_classes_list = current_item['disjoint']
                    for d_classes in d_classes_list:
                        result = self.__mixin_onto.get_selected_concepts(d_classes, 'role')
                        if len(result) >= 2:
                            if super_class['class_name'] not in self.__mixin_list:
                                self.__mixin_list.append(super_class['class_name'])

                            for concept in result:
                                if concept['class_name'] not in self.__mixin_list:
                                    self.__mixin_list.append(concept['class_name'])
                else:
                    sub_class = next_item
                    is_disjoint_complete = self.__mixin_onto.is_disjoint_complete(super_class, sub_class)
                    if sub_class['stereotype'] == 'rolemixin' and not is_disjoint_complete:
                        if super_class['class_name'] not in self.__mixin_list:
                            self.__mixin_list.append(super_class['class_name'])
                        if sub_class['class_name'] not in self.__mixin_list:
                            self.__mixin_list.append(sub_class['class_name'])
            # version 01
            else:
                sub_class = next_item
                if sub_class['stereotype'] == 'role':
                    if len(super_class['disjoint']) > 0:
                        is_disjoint_complete = self.__mixin_onto.is_disjoint_complete(super_class, sub_class)
                        if not is_disjoint_complete:
                            if super_class['class_name'] not in self.__mixin_list:
                                self.__mixin_list.append(super_class['class_name'])
                            if sub_class['class_name'] not in self.__mixin_list:
                                self.__mixin_list.append(sub_class['class_name'])
                    else:
                        if super_class['class_name'] not in self.__mixin_list:
                            self.__mixin_list.append(super_class['class_name'])
                        if sub_class['class_name'] not in self.__mixin_list:
                            self.__mixin_list.append(sub_class['class_name'])

    def get_rolemixin_list(self):
        self.__check_rolemixin()
        return self.__mixin_list