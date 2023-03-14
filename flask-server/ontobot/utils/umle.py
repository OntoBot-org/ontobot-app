import json
with open("ontobot/model/Grammar.json") as user_file:
    rule_contents = user_file.read()

rule_json = json.loads(rule_contents)

# UMLError


class UMLE:
    __taxonomy_list = []
    __set_difference = []
    __err_list = []

    class Err:
        concept_name = ""
        stereotype = ""
        suggestion = ""

    def __init__(self, t_list, set_dif) -> None:  # name, stereotype, level, names
        self.__taxonomy_list.clear()
        self.__set_difference.clear()
        self.__err_list.clear()
        self.__taxonomy_list = t_list
        self.__set_difference = set_dif

    def __get_class(self, cls_name):
        index = 0
        for cls in self.__taxonomy_list:
            index = index + 1
            if cls['class_name'] == cls_name:
                return {"cls": cls, "index": index}

    def __find_super_class(self, next_item, current_index):
        super_level = next_item['level'] - 1
        for index in range(current_index-1, -1, -1):
            concept = self.__taxonomy_list[index]
            if concept['level'] == super_level:
                return concept

    def check_zero_level(self):
        for concept in self.__set_difference:
            err_class = self.__get_class(concept)["cls"]
            if err_class['level'] == 0 and err_class['stereotype'] == 'subkind':
                err_cls = self.Err()
                err_cls.concept_name = concept
                err_cls.stereotype = err_class['stereotype']
                err_cls.suggestion = "Level zero classes without level one class/es cannot be subkind. please check the stereotype of the class again"

                self.__err_list.append({
                    "name": err_cls.concept_name,
                    "stereotype": err_cls.stereotype,
                    "suggestion": err_cls.suggestion
                })

    def check_phase_level(self):
        for concept in self.__set_difference:
            err_class = self.__get_class(concept)["cls"]
            err_index = self.__get_class(concept)["index"]
            if err_class['level'] > 0 and err_class['stereotype'] == 'phase':
                super_cls = self.__find_super_class(err_class, err_index)
                if super_cls['stereotype'] in rule_json['ontoUML']['sortaluniversal']:
                    err_cls = self.Err()
                    err_cls.concept_name = concept
                    err_cls.stereotype = err_class['stereotype']
                    err_cls.suggestion = "This class should be disjoint with a sibling since it is a phase"

                    self.__err_list.append({
                        "name": err_cls.concept_name,
                        "stereotype": err_cls.stereotype,
                        "suggestion": err_cls.suggestion
                    })

    def check_category_level(self):
        for concept in self.__set_difference:
            err_class = self.__get_class(concept)["cls"]
            err_index = self.__get_class(concept)["index"]  
            if err_class['level'] > 0 and err_class['stereotype'] in rule_json['ontoUML']['rigidsortal']:
                super_cls = self.__find_super_class(err_class, err_index)
                if super_cls['stereotype'] == 'category':
                    err_cls = self.Err()
                    err_cls.concept_name = concept
                    err_cls.stereotype = err_class['stereotype']
                    err_cls.suggestion = "This class should be disjoint with a sibling since it is belongs to the "+ err_cls.stereotype+" or you can change this class stereotype as category or role-mixin"

                    self.__err_list.append({
                        "name": err_cls.concept_name,
                        "stereotype": err_cls.stereotype,
                        "suggestion": err_cls.suggestion
                    })
    
    def check_subkind_level(self):
        for concept in self.__set_difference:
            err_class = self.__get_class(concept)["cls"]
            if err_class['level'] > 0 and err_class['stereotype'] == 'kind':
                err_cls = self.Err()
                err_cls.concept_name = concept
                err_cls.stereotype = err_class['stereotype']
                err_cls.suggestion = "A Sub class can't have kind stereotype according to the ontoUML. As a sugesstion, You can change this into subkind."

                self.__err_list.append({
                    "name": err_cls.concept_name,
                    "stereotype": err_cls.stereotype,
                    "suggestion": err_cls.suggestion
                })

    
    def get_err_list(self):
        return self.__err_list
