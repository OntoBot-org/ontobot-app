from ontobot.services import firestore_connect
import random

def generate_intermediate_cls_name(domain:str, range):
    names = []; names.clear()
    names.append(domain)
    names.extend(range)
    names.append(str(random.randint(0,1000)))
    return "_".join(names)

def _generate_ds_property(property:str):
    return "has "+ property

def _generate_rs_property(property:str ,range:str):
    return property+"_"+range

# one domain struct (nAry)
def generate_domain_struct(domain, intermediate_cls, property, uid, level = 0):
    struct = {
            "id": uid,
            "op_name": _generate_ds_property(property),
            "op_inverse": "is "+property+" of",
            "op_equal": "",
            "op_domain": domain,
            "op_range": intermediate_cls,
            "level": level,
            "constraints": {
                "functional": False,
                "inverseFunctional": False,
                "transitive": False,
                "symmetric": False,
                "asymmetric": False,
                "reflexive": False,
                "irreflexive": False
            }
        }
    
    return struct

# multiple range structs (nAry) for usecase 02
def generate_has_struct(intermediate_cls, range, type, uid, level = 0):
    opc = {
        "functional": False,
        "inverseFunctional": False,
        "transitive": False,
        "symmetric": False,
        "asymmetric": False,
        "reflexive": False,
        "irreflexive": False
    }
    
    for op in type[range]:
       
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

    struct = {
            "id": uid,
            "op_name": _generate_ds_property(range), # has Student 
            "op_inverse": "is "+range+" of", # is Student of
            "op_equal": "",
            "op_domain": intermediate_cls, # Teacher
            "op_range": range, # Student
            "level": level,
            "constraints": opc
        }
    
    return struct

# multiple range structs (nAry) for usecase 01
def generate_range_struct(intermediate_cls, range, property, uid, level = 0):
    opc = {
        "functional": False,
        "inverseFunctional": False,
        "transitive": False,
        "symmetric": False,
        "asymmetric": False,
        "reflexive": False,
        "irreflexive": False
    }
    
    struct = {
            "id": uid,
            "op_name": _generate_rs_property(property, range),
            "op_inverse": "",
            "op_equal": "",
            "op_domain": intermediate_cls,
            "op_range": range,
            "level": level,
            "constraints": {
                "functional": True,
                "inverseFunctional": False,
                "transitive": False,
                "symmetric": False,
                "asymmetric": False,
                "reflexive": False,
                "irreflexive": False
            }
        }
    
    return struct


# nAry pattern - Level 01 & 02
def get_nary_structure(op_struct, concepts:list, session_id):
    op_struct_copy = op_struct
    extend_nary = []; extend_nary.clear()
    nary_concept = []; nary_concept.clear()

    for struct in op_struct_copy:
        if len(struct["op_range"]) > 1:
            property_name:str = struct["op_name"]
            op_range = struct["op_range"]   # list
            op_domain:str = struct["op_domain"]
            level = struct['level']
            quantifier = struct['quantifier']
            opType = struct['constraints']

            # n-ary usecase 01
            if property_name.lower() != 'has' and property_name.lower() != 'have' and property_name != "":
                intermediate_cls = generate_intermediate_cls_name(op_domain, op_range)
                concepts.append(intermediate_cls); nary_concept.append({"version": 1, "domain": op_domain, "ranges": op_range, "nary": intermediate_cls})
                extend_nary.append(generate_domain_struct(op_domain, intermediate_cls, property_name, len(extend_nary) + 1, level))
                
                for r_name in op_range:
                    extend_nary.append(generate_range_struct(intermediate_cls, r_name, property_name, len(extend_nary) + 1, level))
            
            # n-ary usecase 02
            elif property_name == "":
                intermediate_cls = op_domain
                concepts.append(intermediate_cls); nary_concept.append({"version": 2, "nary": intermediate_cls, "ranges": op_range})
                for r_name in op_range:
                    nary_struct = generate_has_struct(intermediate_cls, r_name, opType, len(extend_nary) + 1, level)
                    nary_struct["quantifier"] = quantifier[r_name]
                    extend_nary.append(nary_struct)

            # n-ary shortcut        
            else:
                for r_name in op_range:
                    nary_struct = generate_has_struct(op_domain, r_name, opType, len(extend_nary) + 1, level)
                    nary_struct["quantifier"] = quantifier[r_name]

                    extend_nary.append(nary_struct)
            
        

        else:
            struct["id"] = len(extend_nary) + 1
            struct["op_range"] = struct["op_range"][0]
            extend_nary.append(struct)


    firestore_connect.create_nary_document(session_id=session_id, obj={
        "sessionID": session_id,
        "concepts" : nary_concept
    })
    
    return extend_nary
    