import { v4 } from "uuid";

export const stereotypes = [
    {
        id: v4(),
        name: 'kind',
        value: 'kind',
        explanation: 'A rigid and relationally independent category that represents a general class of objects or individuals sharing a set of essential properties.',
        // explanation: 'Kind is rigid and relationally independent category that represents a general class of objects or individuals sharing a set of essential properties. It is used in ontology to represent the fundamental categories of objects or individuals in a domain.',
        examples: 'Crop can be considered as kind',
    },
    {
        id: v4(),
        name: 'subkind',
        value: 'subkind',
        explanation: 'Rigid categories that are defined in relation to a unique substance sortal, which specifies the identity of an object or individual, and can be specialized by other subkinds, but cannot specialize more than one ultimate substance sortal.',
        examples: 'Cereal Crop',
    },
    {
        id: v4(),
        name: 'phase',
        value: 'phase',
        explanation: 'Categories defined as part of a partition of a sortal.',
        // explanation: 'Categories defined as part of a partition of a sortal and are characterized by being anti-rigid and relationally independent. They form a disjoint and complete set of generalizations, and the partition is based on an intrinsic property of the universal.',
        examples: ' Seed, Sprout, Seedling',
    },
    {
        id: v4(),
        name: 'role',
        value: 'role',
        explanation: 'Categories that capture relational properties shared by instances of a given sortal and are defined by their relationships to other entities.',
        // explanation: 'Roles are categories that capture relational properties shared by instances of a given sortal and are defined by their relationships to other entities. They are anti-rigid and relationally dependent sortals, meaning that they are defined by their relationships rather than by their inherent characteristics.',
        examples: 'Farmer, Agriculture Researcher',
    },
    {
        id: v4(),
        name: 'collective',
        value: 'collective',
        explanation: 'Collections of endurant universals that have a uniform structure which requires that the sum of the minimum cardinality constraint on the members be at least 2.',
        // explanation: 'Collections of endurant universals (substantial or moment universals) that have a uniform structure and are bound by the Weak Supplementation Principle, which requires that the sum of the minimum cardinality constraint on the members be at least 2.',
        examples: 'Corn',
    },
    {
        id: v4(),
        name: 'category',
        value: 'category',
        explanation: 'A type of mixin that represents a dispersive universal. It is composed of essential properties that are shared by different rigid sortals.',
        // explanation: 'A category is a type of mixin that represents a dispersive universal, meaning that it is composed of essential properties that are shared by different rigid sortals (kinds, subkinds, or collectives). It is rigid, meaning that it has a fixed set of properties, and it is relationally independent, meaning that its relationships to other entities do not define it.',
        examples: 'Farming equipment, Pest Control Methods, Agriculture buildings',
    },
    {
        id: v4(),
        name: 'rolemixin',
        value: 'rolemixin',
        explanation: 'A category that represents common, contingent, and relationally dependent properties shared by entities that play multiple roles. It captures common properties of roles played by instances of different substance sortals.',
        // explanation: 'A RoleMixin is a category that represents common, contingent, and relationally dependent properties shared by entities that play multiple roles. These roles may be played by instances of different substance sortals (kinds or collectives), and the RoleMixin represents common characteristics shared by these roles. In summary, a RoleMixin captures common properties of roles played by instances of different substance sortals.',
        examples: '',
    },
]