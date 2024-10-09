import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Pencil, Plus } from "lucide-react";
import { updateAI } from "@/utils/api/ai";
import { useWallet } from "@suiet/wallet-kit";

type CategoryKey =
  | "education"
  | "health & fitness"
  | "entertainment"
  | "social networking"
  | "business"
  | "developer tools"
  | "graphics & design"
  | "others";

interface AIData {
  id: string;
  creator_address: string;
  name: string;
  profile_image_url: string;
  category: string;
  introductions: string;
  rag_contents: string;
  rag_comments: string;
}

interface EditAISheetProps {
  ai: AIData;
  onUpdate: (updatedAI: AIData) => void;
}

const EditAISheet: React.FC<EditAISheetProps> = ({ ai, onUpdate }) => {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>(ai.category);
  const [name, setName] = useState(ai.name);
  const [introductions, setIntroductions] = useState(ai.introductions);
  const [data, setData] = useState(ai.rag_contents);
  const [loading, setLoading] = useState(false);
  const wallet = useWallet();
  useEffect(() => {
    if (open) {
      setSelectedCategory(ai.category);
      setName(ai.name);
      setIntroductions(ai.introductions);
      setData(ai.rag_contents);
    }
  }, [open, ai]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value.replace(/\s+/g, "_");
    setName(newName);
  };

  const handleUpdate = async () => {
    setLoading(true);

    const updatedAIData = {
      id: ai.id,
      creator_address: wallet.address ?? "",
      name: name,
      profile_image_url: ai.profile_image_url,
      category: selectedCategory,
      introductions: introductions,
      rag_contents: data,
      rag_comments: "Updated AI",
      examples: "",
    };

    console.log(data);

    try {
      const res = await updateAI(updatedAIData);
      console.log("AI Updated successfully", res);
      onUpdate(updatedAIData);
    } catch (error) {
      console.error("Error updating AI:", error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const categories: string[] = [
    "All",
    "Education",
    "Health & Fitness",
    "Entertainment",
    "Social networking",
    "Business",
    "Developer tools",
    "Graphics & Design",
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="px-4 py-2 bg-primary-50 text-primary-900 rounded-full hover:bg-primary-700 transition-colors flex items-center">
          <Pencil className="mr-2" size={18} />
          Edit AI
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[calc(100vh-4rem)] p-0">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold flex-grow text-center">
              Edit AI
            </h2>
          </div>

          <div className="flex-grow overflow-y-auto p-4 space-y-6">
            <div className="flex justify-center">
              <div className="relative size-20 bg-primary-900 rounded-full overflow-hidden">
                {ai.profile_image_url ? (
                  <img
                    src={ai.profile_image_url}
                    alt={ai.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <input
                    type="file"
                    id="ai-image"
                    className="hidden"
                    accept="image/*"
                  />
                )}
                <label
                  htmlFor="ai-image"
                  className="absolute inset-0 flex items-center justify-center cursor-pointer"
                >
                  <Plus size={32} className="text-white" />
                </label>
              </div>
            </div>

            <div>
              <label
                htmlFor="nickname"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                AI Name
              </label>
              <input
                type="text"
                id="nickname"
                className="w-full p-2 border-b border-gray-300 focus:border-primary-900 focus:outline-none"
                placeholder="Name your AI"
                value={name}
                onChange={handleNameChange}
              />
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const categoryKey = category
                    .toLowerCase()
                    .replace(/ & /g, " ")
                    .replace(/ /g, "-") as CategoryKey;
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(categoryKey)}
                      className={`px-4 py-2 rounded-full ${
                        selectedCategory === categoryKey
                          ? "bg-primary-900 text-white"
                          : "bg-white text-primary-900 border border-primary-900"
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-lg border py-2 px-4">
                <h3 className="font-semibold mb-2 pb-2 border-b">
                  Introduction
                </h3>
                <textarea
                  placeholder="Add a short description"
                  className="w-full text-gray-600 bg-transparent resize-none focus:outline-none"
                  rows={2}
                  value={introductions}
                  onChange={(e) => setIntroductions(e.target.value)}
                />
              </div>

              <div className="bg-white rounded-lg border py-2 px-4">
                <h3 className="font-semibold mb-2">Data</h3>
                <div className="space-y-2">
                  <textarea
                    placeholder="Provide things to learn"
                    className="w-full text-gray-600 bg-transparent border-b border-gray-200 focus:outline-none focus:border-primary-900"
                    rows={3}
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white border-t">
            <button
              className="w-full py-4 bg-primary-50 text-primary-900 hover:bg-primary-700 rounded-full flex items-center justify-center"
              onClick={handleUpdate}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update AI"}
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EditAISheet;
