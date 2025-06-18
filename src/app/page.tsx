"use client";

import { useState } from "react";
import { ethers } from "ethers";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useHelloQuery } from "@/graphql/generated/graphql";

const Home = () => {
    const [address, setAddress] = useState<string | null>(null);
    const [phrase, setPhrase] = useState<string | null>(null);
    const [hello, setHello] = useState<string | null>(null);
    const router = useRouter();

    const { data, error } = useHelloQuery({
        onCompleted(data) {
            console.log("Hello query completed:", data);
            setHello(data.hello);
        },
        onError(err) {
            console.log("Error fetching hello:", err);
            setHello("Error: " + err.message);
        },
    });

    const generateAddress = () => {
        const wallet = ethers.Wallet.createRandom();
        setAddress(wallet.address);
        setPhrase(wallet.mnemonic ? wallet.mnemonic.phrase : null);
    };

    const goToProfile = () => {
        router.push("/profile");
    };

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
                <div className="flex items-center justify-center w-full">
                    <Image
                        className="dark:invert"
                        src="/next.svg"
                        alt="Next.js logo"
                        width={180}
                        height={38}
                        priority
                    />
                </div>

                <div className="flex flex-col gap-4 items-center">
                    <button
                        // onClick={generateAddress}
                        className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                    >
                        Generate Ethereum Address
                    </button>
                    <div>
                        <strong>Server response:</strong>
                        <div className="mt-2">
                            {data?.hello ?? "Loading..."}
                            {error && (
                                <div className="text-red-500">
                                    {error.message}
                                </div>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={goToProfile}
                        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                        Go to profile
                    </button>
                    {address && (
                        <div className="text-center mt-4">
                            <p className="text-sm sm:text-base font-medium">
                                Your Ethereum Address:
                            </p>
                            <p className="text-xs sm:text-sm font-mono break-all mt-2">
                                {address}
                            </p>
                        </div>
                    )}
                    {phrase && (
                        <div className="text-center mt-4">
                            <p className="text-sm sm:text-base font-medium">
                                Your Ethereum phrase:
                            </p>
                            <p className="text-xs sm:text-sm font-mono break-all mt-2">
                                {phrase}
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Home;
