import json
from ontobot.utils import onto

with open('ontobot/model/Grammar.json') as user_file:
    rule_contents = user_file.read()

rule_json = json.loads(rule_contents)


class Category:
    __taxonomy_list = []
    __category_list = []
    __category_onto = {}
    __category_warning_list = []

    def __init__(self, arr):
        self.__category_onto = onto.Taxonomy()
        self.__taxonomy_list = self.__category_onto.get_stack(arr['subclasses'])
        self.__category_list.clear()
        self.__category_warning_list.clear()

    def __check_category(self):
        super_class = {}
        for index in range(len(self.__taxonomy_list) - 1):
            current_item = self.__taxonomy_list[index]
            next_item = self.__taxonomy_list[index + 1]

            if current_item['level'] < next_item['level']:
                super_class = current_item

            if (current_item['level'] == 0 and next_item['level'] == 0) or (next_item['level'] == 0):
                continue

            if current_item['level'] > next_item['level']:
                super_class = self.__category_onto.find_super_class(next_item, index)

            category_expression = 'category'
            if super_class['stereotype'] == category_expression:
                is_parent_valid = True
            else:
                is_parent_valid = False

            if current_item['class_name'] in self.__category_list and next_item['class_name'] in self.__category_list:
                continue

            # variant 01
            if ('disjoint' in current_item) and len(current_item['disjoint']) > 0:
                d_classes_list:list = []
                d_classes_list = current_item['disjoint']
                for d_classes in d_classes_list:
                    result = []
                    for stereotype in rule_json['ontoUML']['rigidsortal']:
                        sub_result = self.__category_onto.get_selected_concepts(d_classes, stereotype)
                        if len(sub_result) > 0:
                            result.extend(sub_result)
                    if is_parent_valid and len(result) >= 2:
                        if super_class['class_name'] not in self.__category_list:
                            self.__category_list.append(super_class['class_name'])

                        for concept in result:
                            if concept['class_name'] not in self.__category_list:
                                self.__category_list.append(concept['class_name'])
                    
                    # add warning message since one pattern violation of a class/concept could be override by another pattern satisfaction
                    if is_parent_valid and len(result) > 0 and len(result) != len(d_classes):
                        set1 = set(d_classes)
                        set2 = set(map(lambda x: x["class_name"], result))
                        invalid_category_set = set1 - set2
                        self.__category_warning_list.append({
                            "topic" : "Category Pattern Warning",
                            "msg" : f"{invalid_category_set} must be in rigid-sortal and disjoint each other completely"
                        })

            # variant 02
            else:
                sub_class = next_item
                is_disjoint_complete = self.__category_onto.is_disjoint_complete(super_class, sub_class)
                if is_parent_valid and sub_class['stereotype'] in rule_json['ontoUML']['nonsortaluniversal'] and not is_disjoint_complete:
                    if super_class['class_name'] not in self.__category_list:
                        self.__category_list.append(super_class['class_name'])
                    if sub_class['class_name'] not in self.__category_list:
                        self.__category_list.append(sub_class['class_name'])
                
                # add warning message since one pattern violation of a class/concept could be override by another pattern satisfaction
                if is_parent_valid and sub_class['stereotype'] not in rule_json['ontoUML']['nonsortaluniversal'] and not is_disjoint_complete:
                    self.__category_warning_list.append({
                        "topic" : "Category Pattern Warning",
                        "msg" : f"Since the super concept has been defined as category, {sub_class['class_name']} should be category or rolemixin or\
                            If {sub_class['class_name']} has siblings and they are in rigid-sortal, disjoint the concept with them"
                    })

    def get_category_list(self):
        self.__check_category()
        return self.__category_list
    
    def get_category_warn_list(self):
        return self.__category_warning_list