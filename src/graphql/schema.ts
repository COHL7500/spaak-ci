import {gql} from "apollo-server-core";


export const typeDefs = gql`
    
    type Law {
        id: Int!
        statusId: String!
        title: String!
        desc: String
    }
    
    type Query {
        law(id: Int!): Law
        allLaws: [Law]
    }
`;