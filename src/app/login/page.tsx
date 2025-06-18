"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/graphql/generated/graphql";
import { userVar } from "@/cache/cache";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const [login] = useLoginMutation({
        onCompleted(data) {
            if (data?.login?.id) {
                userVar({
                    id: data.login.id,
                    username: data.login.username,
                    email: data.login.email,
                });
                router.push("/");
            }
        },
        onError() {
            setError("Invalid credentials");
        },
    });

    const handleLogin = async () => {
        setError(null);
        try {
            login({
                variables: {
                    loginInput: { username, password },
                },
            });
        } catch (err: any) {
            setError(err.message || "Login error");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-2xl font-bold mb-4">Login</h1>
            <button
                className="mb-4 text-blue-500 underline cursor-pointer"
                onClick={() => router.push("/register")}
            >
                Switch to Register
            </button>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border p-2 mb-2 w-64"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border p-2 mb-4 w-64"
            />
            <button
                onClick={handleLogin}
                className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
            >
                Login
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
};

export default Login;
