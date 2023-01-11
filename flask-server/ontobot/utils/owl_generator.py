import string
from owlready2 import *
import types


def OWL_Generator(structure_data):
    onto = get_ontology("http://test.org/onto.owl")
    with onto:
        for item in structure_data['msg']:
            class_name = string.capwords(item['class_name'])
            NewClass = types.new_class(class_name, (owl.Thing,))
            if 'sub_classes' in item.keys():
                for sub_item in item['sub_classes']:
                    sub_class_name = string.capwords(sub_item['class_name'])
                    NewClass2 = types.new_class(
                        sub_class_name, (onto[class_name],))

        onto.save(file="OWLfile.owl", format="rdfxml")

    # for item in structure_data['msg']:
    #     print('item', item['class_name'])
    #     if 'sub_classes' in item.keys():
    #         for sub_item in item['sub_classes']:
    #             print('sub item', sub_item['class_name'])
