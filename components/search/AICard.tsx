import { useRouter } from "next/router";
import { ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import { AICardProps, CardData } from "@/utils/interface";
import AIDetailsPopup from "../explore/AIDetailsPopup";

export const AICard = ({ item }: AICardProps) => {
  const router = useRouter();

  const handleChatClick = () => {
    router.push(`/ai/${item.id}/chat`);
  };

  return (
    <div className="flex items-center justify-between px-2 py-3 border-b border-gray-700 w-full">
      <Dialog>
        <DialogTrigger asChild>
          <div className="flex items-center cursor-pointer flex-grow min-w-0 mr-4">
            {item.profile_image_url ? (
              <Image
                src={item.profile_image_url}
                alt={item.name}
                width={50}
                height={50}
                className="rounded-full mr-4 flex-shrink-0"
              />
            ) : (
              <div className="w-[50px] h-[50px] rounded-full bg-primary-900 mr-4 flex-shrink-0 flex items-center justify-center">
              </div>
            )}
            <div className="min-w-0 flex-grow">
              <h3 className="font-semibold truncate">{item.name}</h3>
              <p className="text-sm text-gray-600 truncate">{item.creator}</p>
            </div>
          </div>
        </DialogTrigger>

        {/* Conditionally render AIDetailsPopup when the dialog is opened */}
        <DialogContent className="sm:max-w-[425px] rounded-3xl p-6 max-h-[80vh] overflow-y-auto">
          <AIDetailsPopup ai_detail={item} />
        </DialogContent>
      </Dialog>

      <button
        className="pl-4 pr-2 py-1 bg-primary-900 bg-opacity-20 text-primary-900 rounded-full hover:bg-primary-700 transition-colors flex items-center flex-shrink-0 whitespace-nowrap"
        onClick={handleChatClick}
      >
        Chat
        <ChevronRight className="ml-1" size={18} />
      </button>
    </div>
  );
};
