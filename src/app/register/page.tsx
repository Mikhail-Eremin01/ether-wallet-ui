"use client";

import { useRouter } from "next/navigation";
import { useRegisterMutation } from "@/graphql/generated/graphql";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useState } from "react";

type RegisterFormInputs = {
    username: string;
    email: string;
    password: string;
};

const Register = () => {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormInputs>();

    const [registerMutation] = useRegisterMutation({
        onCompleted(data) {
            if (data?.register?.id) {
                router.push("/login");
            }
        },
        onError() {
            setError("Registration failed");
        },
    });

    const onSubmit = async (data: RegisterFormInputs) => {
        setError(null);
        try {
            await registerMutation({
                variables: {
                    registerInput: {
                        username: data.username,
                        password: data.password,
                        email: data.email,
                    },
                },
            });
        } catch (err: any) {
            setError(err.message || "Registration error");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-2xl font-bold mb-4">Register</h1>
            <Link
                className="mb-4 text-blue-500 underline cursor-pointer"
                href="/login"
            >
                Switch to Login
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
                    type="email"
                    placeholder="Email"
                    {...register("email", { required: "Email is required" })}
                    className="border p-2 mb-2 w-64"
                />
                {errors.email && (
                    <p className="text-red-500 mb-2">{errors.email.message}</p>
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
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Registering..." : "Register"}
                </button>
            </form>
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
};

export default Register;
