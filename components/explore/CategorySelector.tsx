import { useRef, useState, useEffect } from "react";

export type CategoryKey =
  | "all"
  | "education"
  | "health & fitness"
  | "entertainment"
  | "social networking"
  | "business"
  | "developer tools"
  | "graphics & design"
  | "others";

interface CategorySelectorProps {
  categories: string[];
  selectedCategory: CategoryKey;
  setSelectedCategory: (category: CategoryKey) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollbarRef = useRef<HTMLDivElement>(null);
  const [showScrollbar, setShowScrollbar] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [scrollbarWidth, setScrollbarWidth] = useState(20);
  const [isDragging, setIsDragging] = useState(false);
  const [isWideScreen, setIsWideScreen] = useState(false);

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsWideScreen(window.innerWidth > 450);
    };

    checkScreenWidth();
    window.addEventListener("resize", checkScreenWidth);

    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const hasOverflow = container.scrollWidth > container.clientWidth;
      setShowScrollbar(hasOverflow && isWideScreen);
      if (hasOverflow) {
        const newScrollbarWidth =
          (container.clientWidth / container.scrollWidth) * 100;
        setScrollbarWidth(Math.max(newScrollbarWidth, 10)); // Minimum 10% width
      }
    }
  }, [categories, isWideScreen]);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const maxScroll = container.scrollWidth - container.clientWidth;
      const newPosition =
        (container.scrollLeft / maxScroll) * (100 - scrollbarWidth);
      setScrollPosition(newPosition);
    }
  };

  const handleScrollbarInteraction = (clientX: number) => {
    const container = scrollContainerRef.current;
    const scrollbar = scrollbarRef.current;
    if (container && scrollbar) {
      const rect = scrollbar.getBoundingClientRect();
      const scrollableWidth = rect.width - (rect.width * scrollbarWidth) / 100;
      const scrollPercentage =
        (clientX - rect.left - (rect.width * scrollbarWidth) / 200) /
        scrollableWidth;
      const maxScroll = container.scrollWidth - container.clientWidth;
      container.scrollLeft = Math.max(
        0,
        Math.min(scrollPercentage * maxScroll, maxScroll),
      );
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleScrollbarInteraction(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleScrollbarInteraction(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousemove", handleMouseMove as any);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousemove", handleMouseMove as any);
    };
  }, [isDragging]);

  return (
    <div className="mb-6">
      <div
        ref={scrollContainerRef}
        className="flex space-x-2 overflow-x-auto whitespace-nowrap scrollbar-hide"
        onScroll={handleScroll}
      >
        {categories.map((category) => {
          const categoryKey = category
            .toLowerCase()
            .replace(/ & /g, " ")
            .replace(/ /g, "-") as CategoryKey;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(categoryKey)}
              className={`px-4 rounded-full flex-shrink-0 border-2 transition-colors duration-200 ease-in-out ${
                selectedCategory === categoryKey
                  ? "bg-primary-900 text-white border-primary-900"
                  : "bg-[#181A20] text-primary-900 border-primary-900 hover:bg-primary-900 hover:bg-opacity-20"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
      {showScrollbar && (
        <div
          ref={scrollbarRef}
          className="h-2 bg-gray-200 mt-4 rounded-full cursor-pointer relative"
          onMouseDown={handleMouseDown}
        >
          <div
            className="h-full bg-primary-900 rounded-full absolute top-0"
            style={{
              width: `${scrollbarWidth}%`,
              left: `${scrollPosition}%`,
              transition: isDragging ? "none" : "left 0.1s ease-out",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default CategorySelector;
