'use client';

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Image from "next/image";
import { useAuth } from "./hooks/useAuth";
import { useRouter } from "next/navigation";

export default function Home() {
  const [address, setAddress] = useState<string | null>(null);
  const [phrase, setPhrase] = useState<string | null>(null);

  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/loginPage");
    }
  }, [user, isLoading, router]);

  const generateAddress = () => {
    const wallet = ethers.Wallet.createRandom();
    setAddress(wallet.address);
    setPhrase(wallet.mnemonic ? wallet.mnemonic.phrase : null);
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
              src/app/page.tsx
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">
            Save and see your changes instantly.
          </li>
        </ol>

        <div className="flex flex-col gap-4 items-center">
          <button
            onClick={generateAddress}
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          >
            Generate Ethereum Address
          </button>
          {address && (
            <div className="text-center mt-4">
              <p className="text-sm sm:text-base font-medium">Your Ethereum Address:</p>
              <p className="text-xs sm:text-sm font-mono break-all mt-2">{address}</p>
            </div>
          )}
          {phrase && (
            <div className="text-center mt-4">
              <p className="text-sm sm:text-base font-medium">Your Ethereum phrase:</p>
              <p className="text-xs sm:text-sm font-mono break-all mt-2">{phrase}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
