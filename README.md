# ontobot-app

## Taxonomical Data Structure
```json
{
    "subclasses": [
        {
            "name": "Farmer",
            "stereotype": "kind"
        },
        {
            "name": "Crop",
            "stereotype": "kind"
        },
        {
            "name": "Organization",
            "stereotype": "kind",
            "subclasses": [
                {
                    "name": "School",
                    "stereotype": "subkind"
                },
                {
                    "name": "University",
                    "stereotype": "subkind"
                }
            ]
            
        },
        {
            "name": "Persons",
            "stereotype": "kind",
            "disjoint": [["Child", "Teen", "Adult"], ["Man", "Women"]],
            "subclasses": [
                {
                    "name": "Child",
                    "stereotype": "phase"
                },
                {
                    "name": "Teen",
                    "stereotype": "phase"
                },
                {
                    "name": "Adult",
                    "stereotype": "phase"
                },
                {
                    "name": "Student",
                    "stereotype": "role"
                },
                {
                    "name": "Man",
                    "stereotype": "subkind",
                    "subclasses": [
                        {
                            "name": "Husband",
                            "stereotype": "role"
                        }
                    ]
                },
                {
                    "name": "Women",
                    "stereotype": "subkind",
                    "subclasses": [
                        {
                            "name": "Wife",
                            "stereotype": "role"
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




