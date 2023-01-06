import json

from ontobot.utils import onto

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
                if len(current_item['stereotype']) > 0:
                    self.__custom_list.append(current_item['class_name'])

    def get_custom_list(self):
        self.__check_custom()
        return self.__custom_list