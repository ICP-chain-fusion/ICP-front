import Link from "next/link";
import Logo from "@/assets/logo_suietail.svg";
import { useUserStore } from "@/store/userStore";
import { useEffect, useState } from "react";
import { useWallet } from "@suiet/wallet-kit";
import MetaMaskLoginButton from "@/components/wallet/MetaMaskLogin";
import { MetaMaskProvider } from "metamask-react";

export default function Landing() {
  const { clearUser } = useUserStore();
  const wallet = useWallet();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const handleLogout = async () => {
      if (!isInitialized) {
        clearUser();
        localStorage.clear();

        if (wallet.connected) {
          try {
            await wallet.disconnect();
            console.log("Wallet disconnected successfully");
          } catch (error) {
            console.error("Failed to disconnect wallet:", error);
          }
        }

        setIsInitialized(true);
      }
    };

    handleLogout();
  }, [clearUser, wallet, isInitialized]);

  return (
    <MetaMaskProvider>
      <div className="h-screen flex items-center justify-center">
        <div className="max-w-[600px] w-full mx-auto px-6">
          <Logo className="mx-auto mb-10 relative left-4" />

          <div className="w-full flex flex-col items-center mb-12">
            <div className="font-semibold text-4xl pb-3">Welcome to</div>
            <div className="font-semibold text-4xl pb-4 text-primary-900">
              SuieTail 👋
            </div>
            <div className="text-primary-900 text-center">
              You can tail me anything
            </div>
          </div>
          <Link
            href="https://suiblockblock.gitbook.io/suietail"
            target="_blank"
            className="w-full mb-24 bg-primary-900 text-white font-semibold py-4 rounded-full shadow-md hover:bg-primary-100 transition duration-300 ease-in-out flex items-center justify-center"
          >
            About Us
          </Link>
          <div>
            <div className="flex items-center mb-6">
              <div className="flex-grow border-t border-gray-400"></div>
              <span className="px-4 text-gray-300">Log in/Sign up</span>
              <div className="flex-grow border-t border-gray-400"></div>
            </div>
            <MetaMaskLoginButton />
          </div>
        </div>
      </div>
    </MetaMaskProvider>
  );
}
