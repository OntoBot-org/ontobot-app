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
            "op_inverse": "",
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

# multiple range structs (nAry)
def generate_range_struct(intermediate_cls, range, property, uid, level = 0):
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


# nAry pattern - Level 01
def get_nary_structure(op_struct):
    op_struct_copy = op_struct
    extend_nary = []; extend_nary.clear()
    for struct in op_struct_copy:
        if len(struct["op_range"]) > 1:
            op_range = struct["op_range"]
            op_domain:str = struct["op_domain"]
            intermediate_cls = generate_intermediate_cls_name(op_domain, op_range)
            extend_nary.append(generate_domain_struct(op_domain, intermediate_cls, struct["op_name"], len(extend_nary) + 1, struct['level']))
            
            for r_name in op_range:
                extend_nary.append(generate_range_struct(intermediate_cls, r_name, struct["op_name"], len(extend_nary) + 1, struct['level']))
        
        else:
            struct["id"] = len(extend_nary) + 1
            struct["op_range"] = struct["op_range"][0]
            extend_nary.append(struct)
    
    return extend_nary
    