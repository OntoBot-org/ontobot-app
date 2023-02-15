# ontobot-app

## Taxonomical Data Structure
```json
{
    "subclasses": [
        {
            "name": "Farmer",
            "stereotype": "kind",
             "propertiesList": [
                {
                    "id": "123e4567-e89b-12d3-a456-426614174000",
                    "name": "farmer_name",
                    "datatype": "string",
                    "restrictions": "not null",
                    "functional": true
                },
                {
                    "id": "619e4567-e89b-12d3-a456-537614174000",
                    "name": "farmer_age",
                    "datatype": "int",
                    "restrictions": "non zero",
                    "functional": false
                },
                {
                    "id": "629d4567-c89b-12d3-b456-537614174000",
                    "name": "is_business",
                    "datatype": "boolean",
                    "restrictions": "",
                    "functional": false
                }
            ],
        },
        {
            "name": "Crop",
            "stereotype": "kind",
            "propertiesList": [
                {
                    "id": "123e4567-e89b-12d3-a456-426614174000",
                    "name": "crop_name",
                    "datatype": "string",
                    "restrictions": "not null",
                    "functional": true
                }
            ]
        },
        {
            "name": "Organization",
            "stereotype": "kind",
             "propertiesList": [
                {
                    "id": "123e4567-e89b-12d3-a456-426614174000",
                    "name": "organization_name",
                    "datatype": "string",
                    "restrictions": "not null",
                    "functional": true
                }
            ],
            "subclasses": [
                {
                    "name": "School",
                    "stereotype": "subkind",
                    "propertiesList":[]
                },
                {
                    "name": "University",
                    "stereotype": "subkind",
                    "propertiesList":[]
                }
            ]
            
        },
        {
            "name": "Persons",
            "stereotype": "kind",
            "disjoint": [["Child", "Teen", "Adult"], ["Man", "Women"]],
            "propertiesList":[
                {
                    "id": "123e4567-e89b-12d3-a456-426614174000",
                    "name": "person_name",
                    "datatype": "string",
                    "restrictions": "not null",
                    "functional": true
                }
            ],
            "subclasses": [
                {
                    "name": "Child",
                    "stereotype": "phase",
                    "propertiesList":[],
                },
                {
                    "name": "Teen",
                    "stereotype": "phase",
                    "propertiesList":[],
                },
                {
                    "name": "Adult",
                    "stereotype": "phase",
                    "propertiesList":[],
                },
                {
                    "name": "Student",
                    "stereotype": "role",
                    "propertiesList":[],
                },
                {
                    "name": "Man",
                    "stereotype": "subkind",
                    "propertiesList":[],
                    "subclasses": [
                        {
                            "name": "Husband",
                            "stereotype": "role",
                            "propertiesList":[],
                        }
                    ]
                },
                {
                    "name": "Women",
                    "stereotype": "subkind",
                    "propertiesList":[],
                    "subclasses": [
                        {
                            "name": "Wife",
                            "stereotype": "role",
                            "propertiesList":[],
                        }
                    ]
                }
            ]
        }

    ]
}
```
## OP Data Structure

```json
{
    "id": "02e19c39-4055-48e7-ac83-c3d9411c4ed4", 
    "relationshipLabel": "relationships", 
    "subrelationships": [
        {
            "domain": "crop",
            "equivalentLabel": "",
            "id": "537fbf3c-61a4-415c-a20f-187fd67b5245",
            "inverse": "",
            "ranges": ["soil"],
            "relationshipLabel": "grows",
            "quantifier":{
                "some": true,
                "only": false
            },
            "subrelationships": [
                {
                    "domain": "crop",
                    "equivalentLabel": "",
                    "id": "537fbf3c-61a4-415c-a20f-187fd67b5255",
                    "inverse": "",
                    "ranges": ["soil"],
                    "relationshipLabel": "grows",
                    "quantifier":{
                        "some": true,
                        "only": false
                    },
                    "subrelationships": [],
                    "type": ["Functional"]
                },
                {
                    "domain": "fertilizer",
                    "equivalentLabel": "",
                    "id": "537fbf3c-61a4-415c-a20f-187fd67b5265",
                    "inverse": "",
                    "ranges": ["soil", "climate"],
                    "relationshipLabel": "plantsIn",
                    "quantifier":{
                        "some": true,
                        "only": false
                    },
                    "subrelationships": [],
                    "type": ["Inverse Functional", "Symmetric"]
                }
            ],
            "type": ["Functional"]
        },
        {
            "domain": "climate",
            "equivalentLabel": "",
            "id": "537fbf3c-61a4-415c-a20f-187fd67b5275",
            "inverse": "",
            "ranges": ["weather"],
            "relationshipLabel": "subClassOf",
            "quantifier":{
                "some": false,
                "only": false
            },
            "subrelationships": [],
            "type": ["Functional"]
        },
        {
            "domain": "fertilizer",
            "equivalentLabel": "",
            "id": "537fbf3c-61a4-415c-a20f-187fd67b5285",
            "inverse": "",
            "ranges": ["soil"],
            "relationshipLabel": "partOf",
            "quantifier":{
                "some": false,
                "only": false
            },
            "subrelationships": [],
            "type": ["Transitive"]
        }
    ]
}```




