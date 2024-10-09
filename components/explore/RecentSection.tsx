import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import Card from "./Card";
import AIDetailsPopup from "./AIDetailsPopup";
import { CardData } from "@/utils/interface";
import { useRouter } from "next/router";

interface RecentSectionProps {
  title: string;
  trendCards: CardData[] | null;
  setSelectedAI: (ai: CardData | null) => void;
}

const RecentSection: React.FC<RecentSectionProps> = ({
  title,
  trendCards,
  setSelectedAI,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleChatClick = (e: React.MouseEvent, item: CardData) => {
    e.stopPropagation();
    router.push(`/ai/${item.id}/chat`);
  };

  return (
    <section className="mb-6">
      <h2 className="text-lg font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-2 gap-4">
        {trendCards?.map((item: CardData) => (
          <div key={item.id}>
            <Dialog
              onOpenChange={(open) => {
                setIsOpen(open);
                setSelectedAI(open ? item : null);
              }}
            >
              <DialogTrigger asChild>
                <div className="cursor-pointer">
                  <Card
                    ai_id={item.id}
                    name={item.name}
                    category={item.category}
                    like={item.like}
                    onChatClick={(e) => handleChatClick(e, item)}
                  />
                </div>
              </DialogTrigger>

              {isOpen && (
                <DialogContent>
                  <AIDetailsPopup ai_detail={item} />
                </DialogContent>
              )}
            </Dialog>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecentSection;
