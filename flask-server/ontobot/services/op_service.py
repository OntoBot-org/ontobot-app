from ontobot.utils.onto import OP
from ontobot.utils.rules import nary
from ontobot.model.output import Error,Response


def get_op_structure(parsed_json):
    op = OP()
    try:
        op_struct = op.get_stack(parsed_json['subrelationships'])
        return Response.send_response(get_nary_structure(op_struct))
    except Exception as err:
        return Error.send_something_went_wrong_error(err)

def get_nary_structure(op_struct):
    op_struct_copy = op_struct
    extend_nary = []; extend_nary.clear()
    for struct in op_struct_copy:
        if len(struct["op_range"]) > 1:
            op_range = struct["op_range"]
            op_domain:str = struct["op_domain"]
            intermediate_cls = nary.generate_intermediate_cls_name(op_domain, op_range)
            extend_nary.append(nary.generate_domain_struct(op_domain, intermediate_cls, struct["op_name"], len(extend_nary) + 1))
            
            for r_name in op_range:
                extend_nary.append(nary.generate_range_struct(intermediate_cls, r_name, struct["op_name"], len(extend_nary) + 1))
        
        else:
            struct["id"] = len(extend_nary) + 1
            struct["op_range"] = struct["op_range"][0]
            extend_nary.append(struct)
    
    return extend_nary
    
    