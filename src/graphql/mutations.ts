import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
    mutation Login($loginInput: LoginDto!) {
        login(loginInput: $loginInput) {
            id
            username
            email
        }
    }
`;

export const REGISTER_MUTATION = gql`
    mutation Register($registerInput: RegisterDto!) {
        register(registerInput: $registerInput) {
            id
            username
            email
        }
    }
`;

export const LOGOUT_MUTATION = gql`
    mutation Logout {
        logout
    }
`;
