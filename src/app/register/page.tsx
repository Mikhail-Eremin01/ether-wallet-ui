"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRegisterMutation } from "@/graphql/generated/graphql";

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const [register] = useRegisterMutation({
        onCompleted(data) {
            if (data?.register?.id) {
                router.push("/login");
            }
        },
        onError() {
            setError("Registration failed");
        },
    });

    const handleRegister = async () => {
        setError(null);
        try {
            register({
                variables: {
                    registerInput: { username, password, email },
                },
            });
        } catch (err: any) {
            setError(err.message || "Registration error");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-2xl font-bold mb-4">Register</h1>
            <button
                className="mb-4 text-blue-500 underline cursor-pointer"
                onClick={() => router.push("/login")}
            >
                Switch to Login
            </button>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border p-2 mb-2 w-64"
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                onClick={handleRegister}
                className="bg-green-500 text-white px-4 py-2 rounded"
            >
                Register
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
};

export default Register;
