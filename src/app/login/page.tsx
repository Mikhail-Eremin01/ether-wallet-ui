"use client";

import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/graphql/generated/graphql";
import { userVar } from "@/cache/cache";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useState } from "react";

type LoginFormInputs = {
    username: string;
    password: string;
};

const Login = () => {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormInputs>();

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

    const onSubmit = async (data: LoginFormInputs) => {
        setError(null);
        try {
            await login({
                variables: {
                    loginInput: {
                        username: data.username,
                        password: data.password,
                    },
                },
            });
        } catch (err: any) {
            setError(err.message || "Login error");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-2xl font-bold mb-4">Login</h1>
            <Link
                className="mb-4 text-blue-500 underline cursor-pointer"
                href="/register"
            >
                Switch to Register
            </Link>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col items-center w-full"
            >
                <input
                    type="text"
                    placeholder="Username"
                    {...register("username", {
                        required: "Username is required",
                    })}
                    className="border p-2 mb-2 w-64"
                />
                {errors.username && (
                    <p className="text-red-500 mb-2">
                        {errors.username.message}
                    </p>
                )}
                <input
                    type="password"
                    placeholder="Password"
                    {...register("password", {
                        required: "Password is required",
                    })}
                    className="border p-2 mb-4 w-64"
                />
                {errors.password && (
                    <p className="text-red-500 mb-2">
                        {errors.password.message}
                    </p>
                )}
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Logging in..." : "Login"}
                </button>
            </form>
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
};

export default Login;
