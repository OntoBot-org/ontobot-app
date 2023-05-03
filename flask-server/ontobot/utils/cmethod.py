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
            if op['op_domain'] == iconcept or iconcept in op['op_range']:
                relational_converge_concept_list.append(iconcept)
    
    relational_diverse_list = set(isolated_concepts) - set(relational_converge_concept_list)

    return list(relational_diverse_list)


# convert customized data into taxonomyContents collection document
def convertToTaxonomyContent(result:list):
    copyResult = result.copy()
    for obj in copyResult:
        if ('disjoint' in obj) and len(obj['disjoint']) > 0:
            obj['disjoint'] = [dict((str(i), el) for i, el in enumerate(subarr)) for subarr in obj['disjoint']]
        if ('overlap' in obj) and len(obj['overlap']) > 0:
            obj['overlap'] = [dict((str(i), el) for i, el in enumerate(subarr)) for subarr in obj['overlap']]
        
        if ('sub_classes' in obj and len(obj['sub_classes'])> 0):
            for sub_obj in obj['sub_classes']:
                if len(sub_obj['disjoint']) > 0:
                    sub_obj['disjoint'] = [dict((str(i), el) for i, el in enumerate(subarr)) for subarr in sub_obj['disjoint']]
                
                if len(sub_obj['overlap']) > 0:
                    sub_obj['overlap'] = [dict((str(i), el) for i, el in enumerate(subarr)) for subarr in sub_obj['overlap']]

    return copyResult 


# convert taxonomyContents collection document data into customized data 
def convertFromTaxonomyContent(taxonomyContent):
    copyTaxonomyContent = taxonomyContent # owlComplete object -> sessionID, taxonomy, concepts, op

    for obj in copyTaxonomyContent['taxonomy']:
        # extract values from each object and add them to a new list
        obj['disjoint'] = [[value for value in obj.values()] for obj in obj['disjoint']]
         # extract values from each object and add them to a new list
        obj['overlap'] = [[value for value in obj.values()] for obj in obj['overlap']]
    
    return copyTaxonomyContent
