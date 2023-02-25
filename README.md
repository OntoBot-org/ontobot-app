# ontobot-app

## Taxonomical Data Structure
```json
{
    "subclasses": [
        {
            "name": "Farmer",
            "stereotype": "kind",
            "disjoint": [],
            "overlap": [],
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
            "disjoint": [],
            "overlap": [],
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
            "disjoint": [["School", "University"]],
            "overlap" : [],
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
                    "disjoint": [],
                    "overlap": [],
                    "propertiesList":[]
                },
                {
                    "name": "University",
                    "stereotype": "subkind",
                    "disjoint": [],
                    "overlap": [],
                    "propertiesList":[]
                }
            ]
            
        },
        {
            "name": "Persons",
            "stereotype": "kind",
            "disjoint": [["Child", "Teen", "Adult"], ["Man", "Women"]],
            "overlap":[],
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
                    "disjoint": [],
                    "overlap": [],
                    "propertiesList":[],
                },
                {
                    "name": "Teen",
                    "stereotype": "phase",
                    "disjoint": [],
                    "overlap": [],
                    "propertiesList":[],
                },
                {
                    "name": "Adult",
                    "stereotype": "phase",
                    "disjoint": [],
                    "overlap": [],
                    "propertiesList":[],
                },
                {
                    "name": "Student",
                    "stereotype": "role",
                    "disjoint": [],
                    "overlap": [],
                    "propertiesList":[],
                },
                {
                    "name": "Man",
                    "stereotype": "subkind",
                    "disjoint": [],
                    "overlap": [],
                    "propertiesList":[],
                    "subclasses": [
                        {
                            "name": "Husband",
                            "stereotype": "role",
                            "disjoint": [],
                            "overlap": [],
                            "propertiesList":[],
                        }
                    ]
                },
                {
                    "name": "Women",
                    "stereotype": "subkind",
                    "disjoint": [],
                    "overlap": [],
                    "propertiesList":[],
                    "subclasses": [
                        {
                            "name": "Wife",
                            "stereotype": "role",
                            "disjoint": [],
                            "overlap": [],
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
}
```

## DB Data Structures (Taxonomy Level)

```json
{
    "code": 201,
    "msg": {
        "id": "4961e33b-29d3-47ad-89a2-34d04dfff39b",
        "name": "taxonomies",
        "subclasses": [
            {
                "id": "630bbed3-3bee-47ea-82f3-cf83ecde44bb",
                "name": "Organization",
                "stereotype": "kind",
                "equivalentClass": "",
                "subclasses": [
                    {
                        "id": "5b254519-ba5d-458a-b62f-51814934bd0b",
                        "name": "School",
                        "stereotype": "subkind",
                        "equivalentClass": "",
                        "subclasses": [],
                        "propertiesList": [],
                        "disjoint": [],
                        "overlap": []
                    },
                    {
                        "id": "9535bcda-67fc-45b6-acfd-66a0a1833533",
                        "name": "University",
                        "stereotype": "subkind",
                        "equivalentClass": "",
                        "subclasses": [],
                        "propertiesList": [],
                        "disjoint": [],
                        "overlap": []
                    }
                ],
                "propertiesList": [
                    {
                        "id": "123e4567-e89b-12d3-a456-426614174000",
                        "name": "name",
                        "datatype": "string",
                        "restrictions": "not null",
                        "functional": true
                    },
                    {
                        "id": "619e4567-e89b-12d3-a456-537614174000",
                        "name": "age",
                        "datatype": "int",
                        "restrictions": "non zero",
                        "functional": false
                    }
                ],
                "disjoint": [
                    [
                        "School",
                        "University"
                    ]
                ],
                "overlap": []
            },
            {
                "id": "08f59aac-b169-4e85-a518-7e6d16ece8b9",
                "name": "Student",
                "stereotype": "kind",
                "equivalentClass": "",
                "subclasses": [
                    {
                        "id": "556ba346-9770-4ae2-a88c-7a7f7705634f",
                        "name": "A",
                        "stereotype": "subkind",
                        "equivalentClass": "",
                        "subclasses": [],
                        "propertiesList": [],
                        "disjoint": [],
                        "overlap": []
                    },
                    {
                        "id": "baa6c9c3-5601-4925-9788-c6bc18534dfe",
                        "name": "B",
                        "stereotype": "role",
                        "equivalentClass": "",
                        "subclasses": [],
                        "propertiesList": [],
                        "disjoint": [],
                        "overlap": []
                    }
                ],
                "propertiesList": [
                    {
                        "id": "0",
                        "name": "ID",
                        "datatype": "int",
                        "restrictions": "non zero",
                        "functional": true
                    },
                    {
                        "id": "1",
                        "name": "Student name",
                        "datatype": "string",
                        "restrictions": "not null",
                        "functional": true
                    }
                ],
                "disjoint": [],
                "overlap": []
            },
            {
                "id": "fc4f65d9-f2b0-481a-9e7a-fc4952de5dfd",
                "name": "M6",
                "stereotype": "kind",
                "equivalentClass": "",
                "subclasses": [],
                "propertiesList": [
                    {
                        "id": "0",
                        "name": "ID",
                        "datatype": "int",
                        "restrictions": "non zero",
                        "functional": true
                    },
                    {
                        "id": "1",
                        "name": "M6 name",
                        "datatype": "string",
                        "restrictions": "not null",
                        "functional": true
                    }
                ],
                "disjoint": [],
                "overlap": []
            }
        ],
        "propertiesList": [],
        "disjoint": [],
        "overlap": [],
        "submitted": false
    },
    "type": "success"
}
```

## DB Data Structures (OP Level)

```json
{
    "code": 201,
    "msg": [
        {
            "id": 1,
            "op_name": "grows",
            "op_inverse": "",
            "op_equal": "",
            "op_domain": "crop",
            "op_range": "soil",
            "level": 0,
            "constraints": {
                "functional": true,
                "inverseFunctional": false,
                "transitive": false,
                "symmetric": false,
                "asymmetric": false,
                "reflexive": false,
                "irreflexive": false
            }
        },
        {
            "id": 2,
            "op_name": "grows",
            "op_inverse": "",
            "op_equal": "",
            "op_domain": "crop",
            "op_range": "soil",
            "level": 1,
            "constraints": {
                "functional": true,
                "inverseFunctional": false,
                "transitive": false,
                "symmetric": false,
                "asymmetric": false,
                "reflexive": false,
                "irreflexive": false
            }
        },
        {
            "id": 3,
            "op_name": "has plantsIn",
            "op_inverse": "",
            "op_equal": "",
            "op_domain": "fertilizer",
            "op_range": "fertilizer_soil_climate_515",
            "level": 1,
            "constraints": {
                "functional": false,
                "inverseFunctional": false,
                "transitive": false,
                "symmetric": false,
                "asymmetric": false,
                "reflexive": false,
                "irreflexive": false
            }
        },
        {
            "id": 4,
            "op_name": "plantsIn_soil",
            "op_inverse": "",
            "op_equal": "",
            "op_domain": "fertilizer_soil_climate_515",
            "op_range": "soil",
            "level": 1,
            "constraints": {
                "functional": true,
                "inverseFunctional": false,
                "transitive": false,
                "symmetric": false,
                "asymmetric": false,
                "reflexive": false,
                "irreflexive": false
            }
        },
        {
            "id": 5,
            "op_name": "plantsIn_climate",
            "op_inverse": "",
            "op_equal": "",
            "op_domain": "fertilizer_soil_climate_515",
            "op_range": "climate",
            "level": 1,
            "constraints": {
                "functional": true,
                "inverseFunctional": false,
                "transitive": false,
                "symmetric": false,
                "asymmetric": false,
                "reflexive": false,
                "irreflexive": false
            }
        },
        {
            "id": 6,
            "op_name": "subClassOf",
            "op_inverse": "",
            "op_equal": "",
            "op_domain": "climate",
            "op_range": "weather",
            "level": 0,
            "constraints": {
                "functional": true,
                "inverseFunctional": false,
                "transitive": false,
                "symmetric": false,
                "asymmetric": false,
                "reflexive": false,
                "irreflexive": false
            }
        },
        {
            "id": 7,
            "op_name": "partOf",
            "op_inverse": "",
            "op_equal": "",
            "op_domain": "fertilizer",
            "op_range": "soil",
            "level": 0,
            "constraints": {
                "functional": false,
                "inverseFunctional": false,
                "transitive": true,
                "symmetric": false,
                "asymmetric": false,
                "reflexive": false,
                "irreflexive": false
            }
        },
        {
            "id": 8,
            "op_name": "buy",
            "op_inverse": "",
            "op_equal": "",
            "op_domain": "M6",
            "op_range": "crop",
            "level": 0,
            "constraints": {
                "functional": false,
                "inverseFunctional": false,
                "transitive": true,
                "symmetric": false,
                "asymmetric": false,
                "reflexive": false,
                "irreflexive": false
            }
        }
    ],
    "type": "success"
}
```
## Architecture Diagram
![Architecture drawio](https://user-images.githubusercontent.com/56679833/220068957-c1cba9c5-bf97-48f0-b51c-8056621a8bd0.png)


