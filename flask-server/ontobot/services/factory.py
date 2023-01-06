from ontobot.utils.rules import subkind
from ontobot.utils.rules import phase
from ontobot.utils.rules import category
from ontobot.utils.rules import role
from ontobot.utils.rules import rolemixin
from ontobot.utils.rules import custom

class ODPFactory:

    @classmethod
    def get_ontouml_odp(cls, pattern, parsed_json):
        match pattern:
            case 'subkind':
                return subkind.Subkind(parsed_json)
            case 'phase':
                return phase.Phase(parsed_json)
            case 'category':
                return category.Category(parsed_json)
            case 'rolemixin':
                return rolemixin.RMixin(parsed_json)
            case 'role':
                return role.Role(parsed_json)
            case 'custom':
                return custom.Custom(parsed_json)
            case _:
                raise Exception('something went wrong')


