# custome methods in the util folder
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
def generate_domain_struct(domain, intermediate_cls, property, uid):
    struct = {
            "id": uid,
            "op_name": _generate_ds_property(property),
            "op_inverse": "",
            "op_equal": "",
            "op_domain": domain,
            "op_range": intermediate_cls,
            "level": 0,
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
def generate_range_struct(intermediate_cls, range, property, uid):
    struct = {
            "id": uid,
            "op_name": _generate_rs_property(property, range),
            "op_inverse": "",
            "op_equal": "",
            "op_domain": intermediate_cls,
            "op_range": range,
            "level": 0,
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