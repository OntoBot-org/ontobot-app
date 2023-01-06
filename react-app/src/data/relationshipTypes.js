import { v4 } from "uuid";

export const relationshipTypes = [
    {
        id: v4(),
        label: 'Functional',
        value: 'Functional',
    },
    {
        id: v4(),
        label: 'Inverse Functional',
        value: 'InverseFunctional',
    },
    {
        id: v4(),
        label: 'Reflexive',
        value: 'Reflexive',
    },
    {
        id: v4(),
        label: 'Symetric',
        value: 'Symetric',
    },
    {
        id: v4(),
        label: 'Asymetric',
        value: 'Asymetric',
    },
    {
        id: v4(),
        label: 'Irreflexive',
        value: 'Irreflexive',
    },
    {
        id: v4(),
        label: 'Transitive',
        value: 'Transitive',
    },
]