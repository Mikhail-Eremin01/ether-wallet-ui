"use client";

import { useRouter, usePathname } from "next/navigation";
import { useReactiveVar } from "@apollo/client";
import { userVar } from "@/cache/cache";
import Link from "next/link";
import { useLogoutMutation } from "@/graphql/generated/graphql";

const Header = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [logout] = useLogoutMutation();
    const user = useReactiveVar(userVar);

    const handleLogout = async () => {
        await logout();
        router.push("/login");
        userVar(null);
    };

    if (!user) return null;

    return (
        <header className="sticky top-0 z-50 w-full py-4 px-8 bg-gray-100 dark:bg-gray-900 flex items-center justify-between shadow">
            <div className="font-bold text-lg">Ether Wallet</div>

            <div className="flex items-center space-x-4">
                <Link
                    href="/"
                    className={`px-3 py-2 rounded transition-colors ${
                        pathname === "/"
                            ? "bg-blue-500 text-white"
                            : "hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                >
                    Home
                </Link>
                <Link
                    href="/profile"
                    className={`px-3 py-2 rounded transition-colors ${
                        pathname === "/profile"
                            ? "bg-blue-500 text-white"
                            : "hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                >
                    Profile
                </Link>
            </div>
            <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
                Logout
            </button>
        </header>
    );
};

export default Header;
