
import { SiGraphql, SiProbot } from 'react-icons/si'
import { FaRegQuestionCircle } from 'react-icons/fa'

export const introCardDetails = [
    {
      title: 'What is an ontology?',
      description: 'Ontology is a framework for knowledge representation that describes things, their properties, and the relationships among them in a well-bounded domain.',
      icon: <SiGraphql />,
      directionTop: true
    },
    {
      title: 'What are ODPs?',
      description: 'Modeling solutions to solve recurrent ontology design problems which ensure ontology quality standards.',
      icon: <FaRegQuestionCircle />,
      directionTop: false
    },
    {
      title: 'What is OntoBot?',
      description: 'An approach for creating an ontology for a provided user scenario in the agricultural domain, by determining the most appropriate ontology design pattern.',
      icon: <SiProbot />,
      directionTop: true
    },
  ]