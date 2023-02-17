# identify concepts which doesn't have sub concepts
def __get_isolated_concepts(taxonomy_result):
    invalid_concept = []; invalid_concept.clear()
    for concept in taxonomy_result:
        if concept['level'] == 0 and concept['cardinality'] == 0:
            invalid_concept.append(concept['class_name'])
    
    return invalid_concept

# identify all the domain and range from the first level relationships
def get_relational_diverse_concept_list(taxonomy_result, relationship_list):
    relational_converge_concept_list = []; relational_converge_concept_list.clear()
    relational_diverse_list = []; relational_diverse_list.clear()
    isolated_concepts = __get_isolated_concepts(taxonomy_result)

    for op in relationship_list:
        for iconcept in isolated_concepts:
            if op['domain'] == iconcept or iconcept in op['ranges']:
                relational_converge_concept_list.append(iconcept)
    
    relational_diverse_list = set(isolated_concepts) - set(relational_converge_concept_list)

    return list(relational_diverse_list)
    