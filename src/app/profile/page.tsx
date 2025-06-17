"use client";

import { useHelloQuery } from "@/graphql/generated/graphql";
import { useState } from "react";

const Profile = () => {
    const [hello, setHello] = useState<string | null>(null);

    const { loading, error } = useHelloQuery({
        onCompleted(data) {
            setHello(data.hello);
        },
        onError(err) {
            setHello("Error: " + err.message);
        },
    });

    return (
        <div className="relative p-8 min-h-screen">
            <h1 className="text-xl font-bold mb-4">Profile</h1>
            <div>
                <strong>Server response:</strong>
                <div className="mt-2">
                    {loading ? "Loading..." : hello}
                    {error && <div className="text-red-500">{error.message}</div>}
                </div>
            </div>
        </div>
    );
}

export default Profile;