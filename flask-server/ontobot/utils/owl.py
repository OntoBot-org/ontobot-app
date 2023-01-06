from ontobot.utils import onto


class OWL:
    __taxonomy_list = []
    __owl_onto = {}
    __owl_stack = []
    __concept_list = []

    def __init__(self, input_list):
        self.__concept_list.clear()
        self.__owl_stack.clear()
        self.__owl_onto = onto.Taxonomy()
        self.__taxonomy_list = self.__owl_onto.get_stack(input_list['subclasses'])

    def __is_already_super_class(self, super_class):
        for concept in self.__owl_stack:
            if concept['class_name'] == super_class['class_name']:
                return True

        return False

    def __has_subclass_property(self, super_class):
        for concept in self.__owl_stack:
            if (concept['class_name'] == super_class['class_name']) and ('sub_classes' in concept):
                return True

        return False
    
    def get_taxonomy_concepts(self):
        for item in self.__taxonomy_list:
                self.__concept_list.append(item['class_name'])

        return set(self.__concept_list)
       

    def get_taxonomy_json(self):
        super_class = {}
        for index in range(len(self.__taxonomy_list) - 1):
            current_item = self.__taxonomy_list[index]
            next_item = self.__taxonomy_list[index + 1]

            if current_item['level'] < next_item['level']:
                super_class = current_item

            if (current_item['level'] == 0 and next_item['level'] == 0) or next_item['level'] == 0:
                if current_item['level'] == 0:
                    if self.__is_already_super_class(current_item):
                        self.__owl_stack.append({'class_name': next_item['class_name'], 'level': next_item['level']})
                    else:
                        temp_list = [
                            {'class_name': current_item['class_name'], 'level': current_item['level']},
                            {'class_name': next_item['class_name'], 'level': next_item['level']}
                        ]
                        self.__owl_stack.extend(temp_list)
                else:
                    self.__owl_stack.append({'class_name': next_item['class_name'], 'level': next_item['level']})

                continue

            if current_item['level'] > next_item['level']:
                super_class = self.__owl_onto.find_super_class(next_item, index)

            sub_class = next_item
            if self.__is_already_super_class(super_class):
                if self.__has_subclass_property(super_class):
                    for idx, concept in enumerate(self.__owl_stack):
                        if concept['class_name'] == super_class['class_name']:
                            current_subclass_list: list = self.__owl_stack[idx]['sub_classes']
                            current_subclass_list.append({
                                'class_name': sub_class['class_name'],
                                'level': sub_class['level']
                            })
                            self.__owl_stack[idx]['sub_classes'] = current_subclass_list
                            break
                else:
                    for idx, concept in enumerate(self.__owl_stack):
                        if concept['class_name'] == super_class['class_name']:
                            self.__owl_stack[idx]['sub_classes'] = [
                                {'class_name': sub_class['class_name'], 'level': sub_class['level']}
                            ]
                            break

            else:
                self.__owl_stack.append({
                    'class_name': super_class['class_name'],
                    'level': super_class['level'],
                    'sub_classes': [
                        {'class_name': sub_class['class_name'], 'level': sub_class['level']}
                    ]
                })

        return self.__owl_stack