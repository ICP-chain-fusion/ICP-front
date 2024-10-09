import { useMetaMask } from "metamask-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useUserStore } from "@/store/userStore";
import { fetchUserExists, fetchUser } from "@/utils/api/user";
import { ArrowRightIcon } from "lucide-react";

function MetaMaskLoginButton() {
  const { status, connect, account, chainId, ethereum } = useMetaMask();
  const router = useRouter();
  const { setUser, setUserWallet } = useUserStore();
  const [isAddressVisible, setIsAddressVisible] = useState(false);

  useEffect(() => {
    if (status === "connected" && account) {
      setUserWallet({ address: account });
      setIsAddressVisible(true);
    } else {
      setIsAddressVisible(false);
    }
  }, [status, account, setUserWallet]);

  const handleLoginClick = async () => {
    if (account) {
      try {
        const userExists = await fetchUserExists(account);

        if (userExists) {
          const userInfo = await fetchUser(account);
          setUser(userInfo);
          router.push("/explore");
        } else {
          router.push("/setprofile");
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    }
  };

  return (
    <>
      {status !== "connected" ? (
        <button
          onClick={connect}
          className="w-full bg-[#1F222A] font-semibold py-4 px-6 border border-primary-900 rounded-full mb-8 hover:bg-opacity-70 transition duration-300 ease-in-out"
        >
          Connect MetaMask
        </button>
      ) : (
        <button
          onClick={handleLoginClick}
          className="w-full bg-[#1F222A] font-semibold py-4 px-6 border border-primary-900 rounded-full mb-8 hover:bg-opacity-70 transition duration-300 ease-in-out flex items-center justify-between"
        >
          <div className="flex-grow" />
          <span className="text-center">
            {account?.slice(0, 6)}...{account?.slice(-4)}
          </span>
          <div className="flex-grow flex justify-end">
            <ArrowRightIcon className="size-5" />
          </div>
        </button>
      )}
    </>
  );
}

export default MetaMaskLoginButton;
