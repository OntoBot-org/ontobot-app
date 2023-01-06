class Dict:
    def __init__(self, class_name, stereotype, level, cardinality, disjoint=None):
        self.class_name = class_name
        self.stereotype = stereotype
        self.level = level
        self.cardinality = cardinality
        self.disjoint_with = disjoint


class Taxonomy:
    __lvl = 0
    __stack = []
    __meta_stack = []

    def __rec_traverse_taxonomy(self, arr, level=0):
        # for loop : siblings, same level shift
        for i in arr:
            # recursion call : children do same things for children

            mylist = [i['name'], i['stereotype'], level]
            if ('subclasses' in i) and len(i['subclasses']) > 0:
                mylist.append(len(i['subclasses']))
                if 'disjoint' in i:
                    mylist.append(i['disjoint'])
                    self.__stack.append(mylist)
                else:
                    mylist.append([])
                    self.__stack.append(mylist)
                self.__rec_traverse_taxonomy(i['subclasses'], level + 1)

            else:
                # leaf node
                mylist.append(0)
                mylist.append([])
                self.__stack.append(mylist)

        return self.__stack

    
    def get_selected_concepts(self, concepts: list, stereotype):
        concept_result = []
        for cname in concepts:
            for concept in self.__meta_stack:
                if concept['class_name'] == cname and concept['stereotype'] == stereotype:
                    concept_result.append(concept)
                    break

        return concept_result

    
    def get_stack(self,input_stack: list):
        temp = []  # used to store class names temporarily
        final = []  # used to store concept's objects

        internal_stack = self.__rec_traverse_taxonomy(input_stack)

        for item in internal_stack:
            current_level = item[2]
            current_class = item[0]
            current_stereotype = item[1]
            current_cardinality = item[3]
            current_disjointness = item[4]

            concept: Dict = Dict(current_class, current_stereotype, current_level, current_cardinality,
                                 current_disjointness)
            if concept.class_name not in temp:
                final.append(
                    {
                        "class_name": concept.class_name,
                        "stereotype": concept.stereotype,
                        "level": concept.level,
                        "cardinality": concept.cardinality,
                        "disjoint": concept.disjoint_with
                    }
                )
                temp.append(concept.class_name)

        self.__meta_stack = final
        internal_stack.clear()
        return self.__meta_stack

    def find_super_class(self, next_item, current_index):
        super_level = next_item['level'] - 1
        for index in range(current_index, -1, -1):
            concept = self.__meta_stack[index]
            if concept['level'] == super_level:
                return concept

    def is_disjoint_complete(self, super_class, sub_class):
        disjoint_classes_list = super_class['disjoint']
        for disjoint_classes in disjoint_classes_list:
            if sub_class['class_name'] in disjoint_classes:
                return True

        return False


class OP:
    __lvl = 0
    __stack = []
    __meta_stack = []

    def __rec_traverse_op(self, arr, level=0):
        # for loop : siblings, same level shift
        for i in arr:
            # recursion call : children do same things for children

            mylist = [i['name'], i['equal'], i['inverse'], i['domain'], i['range'], i['opc']]
            if ('sub' in i) and len(i['sub']) > 0:
                self.__stack.append(mylist)
                self.__rec_traverse_op(i['sub'], level + 1)
            else:
                # leaf node
                self.__stack.append(mylist)

        return self.__stack

    @classmethod
    def get_stack(cls, input_stack: list):
        final = []  # used to store concept's objects
        uid = 0

        internal_stack = cls.__rec_traverse_op(OP(), input_stack)
        for item in internal_stack:
            uid += 1
            name = item[0]
            equal = item[1]
            inverse = item[2]
            c_domain = item[3]
            c_range = item[4]
            opc = item[5]
            key = uid

            final.append(
                {
                    "id": key,
                    "op_name": name,
                    "op_inverse": inverse,
                    "op_equal": equal,
                    "op_domain": c_domain,
                    "op_range": c_range,
                    "constraints": opc
                }
            )

        cls.__meta_stack = final
        return final

    @classmethod
    def has_object_property(cls, sub_class):
        for op in cls.__meta_stack:
            if op['op_domain'] == sub_class['class_name'] or op['op_range'] == sub_class['class_name']:
                return True

        return False

    @classmethod
    def get_memberOf_ops(cls):
        op_result = []
        for prop in cls.__meta_stack:
            p_name = str(prop['op_name']).lower()
            p_inv_name = str(prop['op_inverse']).lower()
            if not prop['constraints']['functional'] and not prop['constraints']['inverseFunctional'] and \
                    not prop['constraints']['transitive']:
                condition = True
            else:
                condition = False

            if p_name.startswith('has') and condition:
                prop['op'] = True
                op_result.append(prop)
            if p_inv_name.startswith('has') and condition:
                prop['op'] = False
                op_result.append(prop)

        return op_result


