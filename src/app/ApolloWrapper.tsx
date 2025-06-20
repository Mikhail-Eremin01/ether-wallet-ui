"use client";

import { HttpLink, Observable, from, ApolloLink } from "@apollo/client";
import {
    ApolloNextAppProvider,
    ApolloClient,
    InMemoryCache,
} from "@apollo/client-integration-nextjs";
import { onError } from "@apollo/client/link/error";

// Global state to track if we're refreshing token
let isRefreshing = false;
let pendingRequests: Function[] = [];

// Function to forward the queued operations
const resolvePendingRequests = () => {
    pendingRequests.forEach((callback) => callback());
    pendingRequests = [];
};

function makeClient() {
    const httpLink = new HttpLink({
        uri: "http://localhost:4000/graphql",
        credentials: "include",
        fetchOptions: {
            cache: "no-store",
            credentials: "include",
        },
    });

    const credentialsLink = new ApolloLink((operation, forward) => {
        operation.setContext({
            credentials: "include",
        });
        return forward(operation);
    });

    const refreshToken = async () => {
        try {
            const res = await fetch("http://localhost:4000/graphql", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    query: `mutation { refresh }`,
                }),
                cache: "no-store",
            });

            const data = await res.json();
            return data?.data?.refresh;
        } catch (error) {
            console.error("Error refreshing token:", error);
            return false;
        }
    };

    const errorLink = onError(
        ({ graphQLErrors, networkError, operation, forward }) => {
            if (
                graphQLErrors &&
                graphQLErrors.some(
                    (err) =>
                        err.extensions?.code === "UNAUTHENTICATED" ||
                        err.message?.toLowerCase().includes("unauthorized") ||
                        err.message?.toLowerCase().includes("no token"),
                )
            ) {
                console.log("Auth error detected:", graphQLErrors);

                if (isRefreshing) {
                    return new Observable((observer) => {
                        pendingRequests.push(() => {
                            forward(operation).subscribe({
                                next: observer.next.bind(observer),
                                error: observer.error.bind(observer),
                                complete: observer.complete.bind(observer),
                            });
                        });
                    });
                }

                isRefreshing = true;

                return new Observable((observer) => {
                    refreshToken()
                        .then((success) => {
                            console.log("Refresh token result:", success);
                            isRefreshing = false;

                            if (success) {
                                resolvePendingRequests();

                                const subscriber = {
                                    next: (data: any) => {
                                        observer.next(data);
                                    },
                                    error: (error: any) => {
                                        console.error(
                                            "Error after token refresh:",
                                            error,
                                        );
                                        observer.error(error);
                                    },
                                    complete: () => {
                                        observer.complete();
                                    },
                                };

                                operation.setContext({
                                    fetchOptions: {
                                        cache: "no-store",
                                    },
                                });

                                forward(operation).subscribe(subscriber);
                            } else {
                                if (typeof window !== "undefined") {
                                    window.location.href = "/login";
                                }
                                observer.error(
                                    new Error("Failed to refresh token"),
                                );
                            }
                        })
                        .catch((error) => {
                            console.error(
                                "Error in refresh token flow:",
                                error,
                            );
                            isRefreshing = false;
                            if (typeof window !== "undefined") {
                                window.location.href = "/login";
                            }
                            observer.error(error);
                        });
                });
            }

            if (networkError) {
                console.log(`[Network error]: ${networkError}`);
            }
        },
    );

    return new ApolloClient({
        cache: new InMemoryCache(),
        link: from([errorLink, credentialsLink, httpLink]),
        defaultOptions: {
            query: {
                fetchPolicy: "network-only",
            },
        },
    });
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
    return (
        <ApolloNextAppProvider makeClient={makeClient}>
            {children}
        </ApolloNextAppProvider>
    );
}
