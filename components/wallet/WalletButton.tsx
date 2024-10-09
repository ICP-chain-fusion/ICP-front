import { useEffect, useState } from "react";
import { BaseError, useWallet } from "@suiet/wallet-kit";
import { ConnectButton, ErrorCode } from "@suiet/wallet-kit";
import "@suiet/wallet-kit/style.css";
import { walletAtom } from "@/lib/states";
import { useSetAtom } from "jotai";
import { fetchUserExists, fetchUser } from "@/utils/api/user";
import { useRouter } from "next/router";
import { useUserStore } from "@/store/userStore";
import { User } from "@/utils/interface";
import { ArrowRightIcon } from "lucide-react";

function WalletButton() {
  const wallet = useWallet();
  const setWallet = useSetAtom(walletAtom);
  const router = useRouter();
  const { setUser, setUserWallet } = useUserStore();
  const [isAddressVisible, setIsAddressVisible] = useState(false);

  useEffect(() => {
    if (wallet.connected) {
      console.log("Wallet connected");
      console.log("Current wallet: ", wallet);
      setWallet(wallet);
      setUserWallet(wallet);
      setIsAddressVisible(true);
    } else {
      console.log("Wallet disconnected");
      setIsAddressVisible(false);
    }
  }, [wallet, setWallet, setUserWallet]);

  const handleAddressClick = async () => {
    if (wallet.address) {
      try {
        const userExists = await fetchUserExists(wallet.address);

        if (userExists) {
          const userInfo = await fetchUser(wallet.address);
          const requiredProps: (keyof User)[] = [
            "user_address",
            "nickname",
            "profile_image_url",
            "gender",
            "country",
            "interest",
          ];
          const missingProps = requiredProps.filter(
            (prop) => !(prop in userInfo),
          );

          if (missingProps.length > 0) {
            console.warn(`Missing user properties: ${missingProps.join(", ")}`);
          }

          setUser(userInfo as User);
          router.push("/explore");
        } else {
          router.push("/setprofile");
        }
      } catch (error) {
        console.error("Error checking user or fetching user info:", error);
      }
    }
  };

  return (
    <>
      {!isAddressVisible ? (
        <ConnectButton
          style={{ width: "100%", marginBottom: 10 }}
          onConnectError={(error: BaseError) => {
            if (error.code === ErrorCode.WALLET__CONNECT_ERROR__USER_REJECTED) {
              console.warn(
                "User rejected the connection to " + error.details?.wallet,
              );
            } else {
              console.warn("Unknown connect error: ", error);
            }
          }}
          onConnectSuccess={(walletName: string) => {
            console.log("[Connection Success]: ", walletName);
          }}
        >
          Connect Your Wallet
        </ConnectButton>
      ) : (
        <button
          onClick={handleAddressClick}
          className="w-full bg-[#1F222A] font-semibold py-4 px-6 border border-primary-900 rounded-full mb-8 hover:bg-opacity-70 transition duration-300 ease-in-out flex items-center justify-between"
        >
          <div className="flex-grow" />
          <span className="text-center">
            {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
          </span>
          <div className="flex-grow flex justify-end">
            <ArrowRightIcon className="size-5" />
          </div>
        </button>
      )}
    </>
  );
}

export default WalletButton;
