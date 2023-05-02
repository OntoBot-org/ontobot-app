from ontobot.services import firestore_connect
from ontobot.model.output import Error,Response

def get_nary_concepts(sessionID):
    nary_concepts = []; nary_concepts.clear()
    nary_concepts_result = firestore_connect.get_nary_document(session_id=sessionID)
    if nary_concepts_result is not None:
        for nary in nary_concepts_result['concepts']:
            nary_concepts.append(nary['nary'])
        
        return Response.next(nary_concepts) 
    else:
        return Error.next(err="No session data is found in getting nary concepts", type="sww")

def get_all_concepts(sessionID):
    all_concepts = []; all_concepts.clear()
    owl_complete_result = firestore_connect.get_owlComplete_document(session_id=sessionID)
    if owl_complete_result is not None:
        all_concepts.extend(owl_complete_result['concepts'])
        return Response.next(all_concepts)
    else:
        return Error.next(err="No session data is found in getting all concepts", type="sww")
    

def collect_concepts(sessionID):
    nary_result = get_nary_concepts(sessionID=sessionID)
    all_result = get_all_concepts(sessionID=sessionID)
    if nary_result['code'] == 500:
        return Error.next(err="No session data is found in getting nary concepts", type="sww")
    elif all_result['code'] == 500:
        return Error.next(err="No session data is found in getting all concepts", type="sww")
    else:
        return Response.next({
            "all_concepts": all_result['msg'],
            "nary_concepts": nary_result['msg']
        })