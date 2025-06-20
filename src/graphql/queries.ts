import { gql } from "@apollo/client";

export const GET_HELLO = gql`
    query Hello {
        hello
    }
`;

export const ME = gql`
    query Me {
        me {
            id
            username
            email
        }
    }
`;
