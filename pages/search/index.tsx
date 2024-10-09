import Search from "@/components/Search";
import { AICard } from "@/components/search/AICard";
import CreateCustomAISheet from "@/components/MakeAI";
import { useEffect, useState, useCallback } from "react";
import { CardData } from "@/utils/interface";
import { fetchAIs } from "@/utils/api/ai";
import { ArrowDownUp, ChevronDown } from "lucide-react";

export default function SearchPage() {
  const [searchCards, setSearchCards] = useState<CardData[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"latest" | "popular">("latest");
  const [showSortOptions, setShowSortOptions] = useState(false);

  const loadAIModels = useCallback(async () => {
    setIsLoading(true);
    try {
      const searchData = await fetchAIs(0, 10);
      setSearchCards(searchData.ais);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAIModels();
  }, [loadAIModels]);

  const sortedCards = useCallback(() => {
    if (!searchCards) return [];
    return [...searchCards].sort((a, b) => {
      if (sortBy === "latest") {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      } else {
        return b.chat_count - a.chat_count;
      }
    });
  }, [searchCards, sortBy]);

  const handleSort = (option: "latest" | "popular") => {
    setSortBy(option);
    setShowSortOptions(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mt-2 mb-4">
        <Search setSearch={setSearchCards} />
      </div>
      <div className="flex justify-end px-4 mb-2 relative">
        <button
          className="text-[#00D897] flex items-center"
          onClick={() => setShowSortOptions(!showSortOptions)}
        >
          <ArrowDownUp size={16} className="mr-1" />
          Sort by
        </button>
        {showSortOptions && (
          <div className="absolute top-full right-0 mt-1 bg-[#2A2D36] border border-gray-700 rounded-md shadow-lg z-10">
            <button
              className="block w-full text-left px-4 py-2 hover:bg-[#1F222A] text-white"
              onClick={() => handleSort("latest")}
            >
              Latest
            </button>
            <button
              className="block w-full text-left px-4 py-2 hover:bg-[#1F222A] text-white"
              onClick={() => handleSort("popular")}
            >
              Most Popular
            </button>
          </div>
        )}
      </div>
      <div className="flex-grow overflow-y-auto mb-16">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          sortedCards().map((item) => <AICard key={item.id} item={item} />)
        )}
      </div>
      <div className="fixed bottom-16 left-0 right-0 px-4 mb-4 max-w-[600px] mx-auto">
        <CreateCustomAISheet onAICreated={loadAIModels} />
      </div>
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: {
      title: "Search",
    },
  };
}
