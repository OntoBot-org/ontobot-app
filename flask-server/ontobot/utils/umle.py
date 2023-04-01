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
                    err_cls.suggestion = f"This {concept} class/concept should have at least one phase sibling and be disjoint with other phase/s since {concept} is a phase concept.\
                        If you have defined more phase siblings with this concept, please make them all disjoint together\
                        If you don't want to define another phase sibling, you can change the stereotype into role"

                    self.__err_list.append({
                        "name": err_cls.concept_name,
                        "stereotype": err_cls.stereotype,
                        "suggestion": err_cls.suggestion
                    })
                else:
                    err_cls = self.Err()
                    err_cls.concept_name = concept
                    err_cls.stereotype = err_class['stereotype']
                    err_cls.suggestion = "Please define the stereotype of super-concept of this concept to Sortal Expression (ie: kind/collective)"

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
            err_index = self.__get_class(concept)["index"]

            if err_class['level'] > 0 and err_class['stereotype'] == 'kind':
                super_cls = self.__find_super_class(err_class, err_index)
                if super_cls['stereotype'] != 'category':
                    err_cls = self.Err()
                    err_cls.concept_name = concept
                    err_cls.stereotype = err_class['stereotype']
                    err_cls.suggestion = "A Sub-concept can't have kind stereotype if the Super-concept is not defined as category according to the ontoUML. As a sugesstion, You can change this into subkind."

                    self.__err_list.append({
                        "name": err_cls.concept_name,
                        "stereotype": err_cls.stereotype,
                        "suggestion": err_cls.suggestion
                    })
            
            if err_class['level'] == 0 and err_class['stereotype'] == 'subkind':
                err_cls = self.Err()
                err_cls.concept_name = concept
                err_cls.stereotype = err_class['stereotype']
                err_cls.suggestion = "A Super-Concept can't have subkind stereotype according to the ontoUML. As a sugesstion, You can change this into kind."

                self.__err_list.append({
                    "name": err_cls.concept_name,
                    "stereotype": err_cls.stereotype,
                    "suggestion": err_cls.suggestion
                })
            
            if err_class['level'] == 0 and err_class['stereotype'] == 'kind':
                err_cls = self.Err()
                err_cls.concept_name = concept
                err_cls.stereotype = err_class['stereotype']
                err_cls.suggestion = "Since this concept is a Super-concept and it has Sub-concepts, there are many suggestions according to the ontoUML.\
                As suggestions, \n 1) Please check whether you have correctly define the disjoint property(ie: If sub-concepts are in phase, please make all of them disjoint) 2) Change all the Sub-consepts into subkind since Super-concept is in kind format \n 2) If you don't want to disjoint the Sub-concepts you can define them as role format\n\
                    3) If there are disjoint Sub-consepts, please check wether all of them are subkind or phase. If not do changes since disjoint set should be in either subkind format or phase format"

                self.__err_list.append({
                    "name": err_cls.concept_name,
                    "stereotype": err_cls.stereotype,
                    "suggestion": err_cls.suggestion
                })

            if err_class['level'] > 0 and err_class['stereotype'] == 'subkind':
                err_class = self.__get_class(concept)["cls"]
                err_index = self.__get_class(concept)["index"]
                
                super_cls = self.__find_super_class(err_class, err_index)
                err_cls = self.Err()
                err_cls.concept_name = concept
                err_cls.stereotype = err_class['stereotype']
                
                if super_cls['stereotype'] == 'phase':
                    err_cls.suggestion = f"Since the super concept is phase, you can change the {concept} into role"
                else:    
                    err_cls.suggestion = f"Please make other sibling concept/s which is/are disjoint with {concept} concept into subkind.\
                    If there are disjoint sibling concepts with same stereotype, you can change the {concept} concept's stereotype into stereotype of \
                    disjoint completed sibling concepts and make disjoint with them. Additionally, change the stereotype of the Super-concept into subkind if it is not a level-0 concept"

                self.__err_list.append({
                    "name": err_cls.concept_name,
                    "stereotype": err_cls.stereotype,
                    "suggestion": err_cls.suggestion
                })
    
    def check_rolemixin_level(self):
        for concept in self.__set_difference:
            err_class = self.__get_class(concept)["cls"]
            err_index = self.__get_class(concept)["index"]  
            if err_class['level'] > 0 and err_class['stereotype'] == 'role':
                super_cls = self.__find_super_class(err_class, err_index)
                if super_cls['stereotype'] == 'rolemixin':
                    err_cls = self.Err()
                    err_cls.concept_name = concept
                    err_cls.stereotype = err_class['stereotype']
                    err_cls.suggestion = "Since super-concept of the concept is rolemixin, there should be multiple role sub-concepts with disjoint-complete\
                         and if there is no multiple sub-concepts, this single sub-concepts should be rolemixin"

                    self.__err_list.append({
                        "name": err_cls.concept_name,
                        "stereotype": err_cls.stereotype,
                        "suggestion": err_cls.suggestion
                    })
                else :
                    # This checking is valid for role-pattern as well
                    err_cls = self.Err()
                    err_cls.concept_name = concept
                    err_cls.stereotype = err_class['stereotype']
                    err_cls.suggestion = "Since super-concept of the concept is not rolemixin, the stereotype of the super-concept should be\
                        in sortal expression (kind,collective,phase,role)"

                    self.__err_list.append({
                        "name": err_cls.concept_name,
                        "stereotype": err_cls.stereotype,
                        "suggestion": err_cls.suggestion
                    })

            if err_class['level'] == 0 and err_class['stereotype'] == 'rolemixin':
                err_cls = self.Err()
                err_cls.concept_name = concept
                err_cls.stereotype = err_class['stereotype']
                err_cls.suggestion = "Since this concept is rolemixin, it can't be isolated concept and sub-concepts should be role or rolemixin"

                self.__err_list.append({
                    "name": err_cls.concept_name,
                    "stereotype": err_cls.stereotype,
                    "suggestion": err_cls.suggestion
                })
    
    def get_err_list(self):
        return self.__err_list
