class Dict:
    def __init__(self, class_name, stereotype, plist, level, cardinality, equal_class, disjoint=None, overlap=None):
        self.class_name = class_name
        self.stereotype = stereotype
        self.level = level
        self.cardinality = cardinality
        self.disjoint_with = disjoint
        self.overlap_with = overlap
        self.data_property = plist
        self.equal_class = equal_class


class Taxonomy:
    __lvl = 0
    __stack = []
    __meta_stack = []

    def __rec_traverse_taxonomy(self, arr, level=0):
        # for loop : siblings, same level shift
        for i in arr:
            # recursion call : children do same things for children

            mylist = [i['name'], i['stereotype'], i['equivalentClass'], i['propertiesList'], level]
            if ('subclasses' in i) and len(i['subclasses']) > 0:
                mylist.append(len(i['subclasses']))  # cardinality
                if 'disjoint' in i:
                    mylist.append(i['disjoint'])  # disjoint
                    self.__stack.append(mylist)
                else:
                    mylist.append([])  # disjoint
                    self.__stack.append(mylist)

                if 'overlap' in i:
                    mylist.append(i['overlap'])  # overlap
                    self.__stack.append(mylist)
                else:
                    mylist.append([])  # overlap
                    self.__stack.append(mylist)

                self.__rec_traverse_taxonomy(i['subclasses'], level + 1)

            else:
                # leaf node
                mylist.append(0)  # cardinality
                mylist.append([])  # disjoint
                mylist.append([])  # overlap
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

    def get_stack(self, input_stack: list):
        temp = []  # used to store class names temporarily
        final = []  # used to store concept's objects

        internal_stack = self.__rec_traverse_taxonomy(input_stack)

        for item in internal_stack:
            current_level = item[4]
            current_class = item[0]
            current_equal_class = item[2]
            current_stereotype = item[1]
            current_cardinality = item[5]
            current_disjointness = item[6]
            current_overlapness = item[7]
            current_plist = item[3]

            concept: Dict = Dict(current_class, current_stereotype, current_plist, current_level, current_cardinality, current_equal_class,
                                 current_disjointness, current_overlapness)
            if concept.class_name not in temp:
                final.append(
                    {
                        "class_name": concept.class_name,
                        "equal_class_name": concept.equal_class,
                        "stereotype": concept.stereotype,
                        "attributes": concept.data_property,
                        "level": concept.level,
                        "cardinality": concept.cardinality,
                        "disjoint": concept.disjoint_with,
                        "overlap": concept.overlap_with
                    }
                )
                # temp.append(concept.class_name)

        self.__meta_stack = self.__remove_consecatives(meta_stack=final)
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

    def __remove_consecatives(self, meta_stack: list):
        filtered_meta_stack = []
        filtered_meta_stack.clear()
        meta_stack_copy = meta_stack.copy()
        for i, obj in enumerate(meta_stack_copy):
            if i == 0 or (obj['class_name'] != meta_stack_copy[i-1]['class_name'] or obj['level'] != meta_stack_copy[i-1]['level']):
                filtered_meta_stack.append(obj)

        return filtered_meta_stack


class OP:
    __lvl = 0
    __stack = []
    __meta_stack = []

    def __init__(self):
        self.__stack.clear()
        self.__meta_stack.clear()

    def __rec_traverse_op(self, arr, level=0):
        # for loop : siblings, same level shift
        for i in arr:
            # recursion call : children do same things for children

            mylist = [i['relationshipLabel'], i['equivalentLabel'], i['inverse'],
                      i['domain'], i['ranges'],  level]
            if ('subrelationships' in i) and len(i['subrelationships']) > 0:
                self.__stack.append(mylist)
                self.__rec_traverse_op(i['subrelationships'], level + 1)
            else:
                # leaf node
                self.__stack.append(mylist)

        return self.__stack

    @classmethod
    def __convert_type(cls, range: list):
        opc = {
            "functional": False,
            "inverseFunctional": False,
            "transitive": False,
            "symmetric": False,
            "asymmetric": False,
            "reflexive": False,
            "irreflexive": False
        }
        constraints = {}
        type_arr = []
        if len(range) == 1:  # simple OP
            type_arr = range[0]['relationshipTypes'].copy()
            
            for op in type_arr:
                if op == "Functional":
                    opc['functional'] = True
                elif op == "Inverse Functional":
                    opc['inverseFunctional'] = True
                elif op == "Symmetric":
                    opc['symmetric'] = True
                elif op == "Reflexive":
                    opc['reflexive'] = True
                elif op == "Irreflexive":
                    opc['irreflexive'] = True
                else:
                    opc['transitive'] = True

            constraints = opc

        else:
            for range_obj in range:
                range_name = range_obj['name']
                type_arr = range_obj['relationshipTypes'].copy()

                constraints[range_name] = type_arr

        return constraints

    @classmethod
    def __convert_quantifier(cls, range: list):
        quantifier = {}
        if len(range) == 1:
            range_obj = range[0]
            quantifier['some'] = range_obj['some']
            quantifier['only'] = range_obj['only'] 
            quantifier['min'] = range_obj['min'] 
            quantifier['max'] = range_obj['max']  

        else:
            for range_obj in range:
                range_name = range_obj['name']
                some = range_obj['some']
                only = range_obj['only']
                min = range_obj['min']
                max = range_obj['max']

                quantifier[range_name] = {
                    "some": some,
                    "only": only,
                    "min": min,
                    "max": max
                }

        return quantifier
    
    @classmethod
    def __convert_ranges(cls, range: list):
        ranges = []
        for range_obj in range:
            ranges.append(range_obj['name'])

        return ranges 

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
            level = item[5]
            key = uid

            convert_ranges = cls.__convert_ranges(c_range)
            convert_quantifiers = cls.__convert_quantifier(c_range)
            convert_constraints = cls.__convert_type(c_range)

            final.append(
                {
                    "id": key,
                    "op_name": name,
                    "op_inverse": inverse,
                    "op_equal": equal,
                    "op_domain": c_domain,
                    "op_range": convert_ranges,
                    "level": level,
                    "quantifier": convert_quantifiers,
                    "constraints": convert_constraints
                }
            )

        cls.__meta_stack = final
        return final

    @classmethod
    def has_object_property(cls, sub_class):
        # object properties are not filled yet
        if len(cls.__meta_stack) == 0:
            return True

        for op in cls.__meta_stack:
            if op['op_domain'] == sub_class['class_name'] or sub_class['class_name'] in op['op_range']:
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
