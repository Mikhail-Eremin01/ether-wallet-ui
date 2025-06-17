"use client";

import { useMeQuery } from "@/graphql/generated/graphql";
import { userVar } from "@/cache/cache";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Header from "@/components/Header";

const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const pathname = usePathname();
    const isAuthPage = pathname === "/login" || pathname === "/register";

    const { error } = useMeQuery({
        onCompleted: (data) => {
            userVar(data?.me ?? null);
        },
        onError: () => {
            userVar(null);
        },
        fetchPolicy: "network-only",
        skip: isAuthPage,
    });
	
    useEffect(() => {
        if (error) {
            router.push("/login");
        }
    }, [error, router, isAuthPage]);

    if (isAuthPage) {
        return <>{children}</>;
    }

    return (
        <>
            <Header />
            {children}
        </>
    );
}

export default UserProvider;