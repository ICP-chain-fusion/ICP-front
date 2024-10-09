/* eslint-disable @next/next/no-img-element */
import { fetchSearchAIs } from "@/utils/api/ai";
import { SearchIcon } from "lucide-react";
import { SetStateAction, useEffect, useState, useRef } from "react";
import { CardData } from "@/utils/interface";
import { useWallet } from "@suiet/wallet-kit";

interface SearchProps {
  setSearch: React.Dispatch<React.SetStateAction<CardData[] | null>>;
}

const Search = ({ setSearch }: SearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [results, setResults] = useState<any>(null); // results 초기값을 null로 설정
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 초기값을 false로 설정
  const [showSearch, setShowSearch] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null); // Ref for the search input
  const wallet = useWallet();

  // Debouncing: 입력이 멈춘 후 500ms 동안 아무 변화가 없으면 debouncedQuery 업데이트
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500); // 500ms 대기 시간

    return () => {
      clearTimeout(handler); // 타이머 초기화 (입력이 계속 진행되면 이전 타이머 취소)
    };
  }, [searchQuery]);

  // debouncedQuery가 변경되면 서버에 요청을 보냄
  useEffect(() => {
    if (debouncedQuery) {
      const searchAIs = async () => {
        setIsLoading(true); // 로딩 상태 true로 설정
        setError(null); // 오류 메시지 초기화
        try {
          const data = await fetchSearchAIs(
            debouncedQuery,
            wallet.address ? wallet.address : ""
          );
          if (data && data.ais) {
            setSearch(data.ais);
          } else {
            setError("No data found");
            setSearch(null); // 데이터가 없으면 results를 null로 설정
          }
        } catch (error) {
          setError(
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
          );
        } finally {
          setIsLoading(false); // 로딩 완료 후 로딩 상태 false로 설정
        }
      };

      searchAIs();
    }
  }, [debouncedQuery]);

  const onSearchChange = (query: SetStateAction<string>) => {
    setSearchQuery(query);
    setShowSearch(true);
  };

  // 클릭한 곳이 input 바깥인지 확인하는 이벤트 핸들러
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearch(false); // 클릭한 곳이 input 바깥일 때 검색 결과를 숨김
      }
    };

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full relative" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          placeholder="Search your best-fit AI"
          className="w-full p-3 pl-10 bg-[#262A35] rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          onChange={(e) => onSearchChange(e.target.value)}
          onClick={(e) => e.stopPropagation()}
        />
        <SearchIcon
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
      </div>
    </div>
  );
};

export default Search;
