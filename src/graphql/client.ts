import {
    ApolloClient,
    InMemoryCache,
    createHttpLink,
    from,
    Observable,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";

const httpLink = createHttpLink({
    uri: "http://localhost:4000/graphql",
    credentials: "include",
});

const refreshToken = async () => {
    const res = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            query: `mutation { refresh }`,
        }),
    });
    const data = await res.json();
    return data?.data?.refresh;
};

const errorLink = onError(({ graphQLErrors, operation, forward }) => {
    if (
        graphQLErrors &&
        graphQLErrors.some(
            (err) =>
                err.extensions?.code === "UNAUTHENTICATED" ||
                err.message?.toLowerCase().includes("unauthorized") ||
                err.message?.toLowerCase().includes("no token"),
        )
    ) {
        console.log("test")
        return new Observable((observer) => {
            refreshToken()
                .then((success) => {
                    if (success) {
                        forward(operation).subscribe({
                            next: observer.next.bind(observer),
                            error: observer.error.bind(observer),
                            complete: observer.complete.bind(observer),
                        });
                    } else {
                        window.location.href = "/login";
                    }
                })
                .catch(() => {
                    window.location.href = "/login";
                });
        });
    }
});

export const apolloClient = new ApolloClient({
    link: from([errorLink, httpLink]),
    cache: new InMemoryCache(),
});
