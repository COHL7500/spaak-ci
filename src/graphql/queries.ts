// lib/queries.ts
import { gql } from '@apollo/client';

export const GET_LAW = gql`
    query GetLaw($id: Int!) {
        law(id: $id) {
            id
            statusId
            title
            desc
        }
    }
`;

export const GET_ALL_LAWS = gql`
    query GetAllLaws {
        allLaws {
            id
            statusId
            title
            desc
        }
    }
`;
