from ontobot.utils.onto import OP
from ontobot.model.output import Error,Response


def get_op_structure(parsed_json):
    op = OP()
    try:
        op_struct = op.get_stack(parsed_json['subrelationships'])
        return Response.send_response(op_struct)
    except Exception as err:
        return Error.send_something_went_wrong_error(err)


    