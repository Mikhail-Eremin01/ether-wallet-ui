import { User } from "@/graphql/generated/graphql";
import { makeVar } from "@apollo/client";

export const userVar = makeVar<User | null>(null);

// ...existing code...
