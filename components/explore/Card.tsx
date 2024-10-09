import { useState } from "react";
import { useWallet } from "@suiet/wallet-kit";
import { addLike, delLike } from "@/utils/api/user";
import { Heart } from "lucide-react";

interface CardProps {
  ai_id: string;
  name: string;
  category: string;
  like: boolean;
  onChatClick: (e: React.MouseEvent) => void;
}

const Card: React.FC<CardProps> = ({ name, category, ai_id, like }) => {
  const wallet = useWallet();
  const [likes, setLikes] = useState(like);

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!wallet.address) {
      window.alert("Please log in to like AIs");
      return;
    }

    const userData = {
      user_address: wallet.address,
      ai_id: ai_id,
    };

    try {
      if (likes) {
        await delLike(userData);
        setLikes(false);
      } else {
        await addLike(userData);
        setLikes(true);
      }
    } catch (error) {
      window.alert("Failed to update like status");
    }
  };


  return (
    <div className="p-4 bg-[#1F222A] rounded-[16px] shadow-md relative flex flex-col">
      <div className="bg-primary-900 rounded-[16px] size-14 mb-4"></div>
      <div className="flex-grow flex flex-col">
        <h3 className="text-sm font-semibold overflow-hidden text-ellipsis whitespace-nowrap mb-2">
          {name}
        </h3>
        <p className="text-xs text-gray-500">{category}</p>
      </div>
      <button
        className="absolute top-3 right-3"
        onClick={handleLikeClick}
      >
        <Heart
          color={likes ? "#F75555" : "white"}
          fill={likes ? "#F75555" : "none"}
          size={24}
        />
      </button>
    </div>
  );
};

export default Card;
