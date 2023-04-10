# It returns the domain concepts which is not match with collective pattern
# collective pattern 01
def get_collective_pattern_stage_01(taxonomy_result, op_structure):
    collective_concepts = []; collective_concepts.clear()
    invalid_collective_concepts = []; invalid_collective_concepts.clear()

    for op in op_structure:
        if op['op_name'].lower() == 'memberof':
            collective_concepts.append(op['op_domain'])
    
    for concept in collective_concepts:
        for taxo in taxonomy_result:
            if concept == taxo['class_name'] and taxo['stereotype'] != "collective":
                invalid_collective_concepts.append(concept)
    
    return invalid_collective_concepts


# collective pattern 02
def get_collective_pattern_stage_02(op_structure):
    invalid_endurant_concepts = []; invalid_endurant_concepts.clear()
    for op in op_structure:
        if op['op_name'].lower() == 'memberof':
            if len(op['op_range']) == 1:
                endurant_concept = op['op_range'][0]
                if op["quantifier"]['min'] < 2:
                    invalid_endurant_concepts.append(endurant_concept)
                
            else:
                for op_range in op['op_range']:
                    if op['quantifier'][op_range]['min'] < 2:
                        invalid_endurant_concepts.append(op_range)
    
    return invalid_endurant_concepts