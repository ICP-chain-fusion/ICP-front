import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchMyAIs } from "@/utils/api/ai";
import { AIDetailProps } from "@/utils/interface";
import { useWallet } from "@suiet/wallet-kit";
import { Plus, PlusCircle } from "lucide-react";
import avatarImage from "@/assets/avatar.png";

interface AIBalanceCardProps {
  name: string;
  category: string;
  imageSrc?: string;
  usage: number;
  earnings: number;
}

const AIBalanceCard: React.FC<AIBalanceCardProps> = ({
  name,
  category,
  imageSrc,
  usage,
  earnings,
}) => {
  return (
    <div className="bg-[#2A2D36] rounded-xl p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center flex-grow mr-4">
          <Image
            src={imageSrc || avatarImage}
            alt={name}
            width={48}
            height={48}
            className="rounded-full mr-3 flex-shrink-0"
          />
          <div className="flex flex-col min-w-0">
            <h3 className="text-lg text-white font-semibold truncate max-w-[150px]">
              {name}
            </h3>
            <div className="flex items-center mt-1">
              <span className="text-xs text-primary-900 px-2 py-1 rounded-full border border-primary-900 whitespace-nowrap">
                {category}
              </span>
            </div>
          </div>
        </div>
        <button className="text-primary-900 font-medium flex-shrink-0">
          Collect
        </button>
      </div>
      <div className="flex mt-4 divide-x divide-gray-300">
        <div className="flex-1 flex flex-col items-center justify-center">
          <p className="text-sm text-gray-500">Usage</p>
          <p className="text-lg text-white">{usage} tokens</p>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center">
          <p className="text-sm text-gray-500">Earnings</p>
          <p className="text-lg text-white">$ {earnings.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

const MyBalancePage = () => {
  const [myAIs, setMyAIs] = useState<AIDetailProps[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const wallet = useWallet();

  useEffect(() => {
    const loadAIModels = async () => {
      if (wallet.address) {
        try {
          const todayData = await fetchMyAIs(wallet.address);
          setMyAIs(todayData.ais);
          setIsLoading(false);
        } catch (error) {
          console.error(error);
          setIsLoading(false);
        }
      }
    };
    loadAIModels();
  }, [wallet.address]);

  if (isLoading) {
    return <div className="text-white">Loading...</div>;
  }

  if (!wallet.address) {
    return (
      <div className="text-white">
        Please connect your wallet to view your balance.
      </div>
    );
  }

  const totalEarnings =
    myAIs?.reduce((sum, ai) => sum + ai.total_token_usage * 0.01, 0) || 0;
  const totalBalance = 437000; // This should be fetched from an API or calculated

  return (
    <div className="">
      <div className="bg-primary-900 bg-opacity-[42%] rounded-xl p-4 mb-6 text-center">
        <div className="flex justify-between mb-4">
          <div className="flex-1 pr-2 ">
            <p className="text-[#B9F0DE] text-sm mb-1">My Balance</p>
            <p className="text-white text-2xl font-bold">
              $ {totalBalance.toLocaleString()}
            </p>
          </div>
          <div className="w-px bg-[#B9F0DE] self-stretch mx-2"></div>
          <div className="flex-1 pl-2">
            <p className="text-[#B9F0DE] text-sm mb-1">Earnings</p>
            <p className="text-white text-2xl font-bold">
              $ {totalEarnings.toLocaleString()}
            </p>
          </div>
        </div>
        <button className="w-full bg-primary-900 text-white py-1 rounded-full font-semibold flex items-center justify-center">
          <Plus className="mr-2" /> Charge
        </button>
      </div>

      <h2 className="text-white text-xl font-semibold mb-4">
        Overview of My Creations
      </h2>
      {myAIs?.map((ai) => (
        <AIBalanceCard
          key={ai.id}
          name={ai.name}
          category={ai.category}
          imageSrc={ai.profile_img_url}
          usage={ai.total_token_usage}
          earnings={ai.total_token_usage * 0.01}
        />
      ))}
    </div>
  );
};

export default MyBalancePage;

export async function getStaticProps() {
  return {
    props: {
      title: "My Balance",
    },
  };
}
