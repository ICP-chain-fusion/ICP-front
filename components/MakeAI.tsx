import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Plus, Camera } from "lucide-react";
import { createAI } from "@/utils/api/ai";
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

interface CreateCustomAISheetProps {
  onAICreated: () => void;
}

const CreateCustomAISheet: React.FC<CreateCustomAISheetProps> = ({
  onAICreated,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [name, setName] = useState("");
  const [introductions, setIntroductions] = useState("");
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [nameError, setNameError] = useState("");

  const wallet = useWallet();
  //ai 이름 띄어쓰기 변경
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value.replace(/\s+/g, "_");
    if (newName.length <= 18) {
      setName(newName);
      setNameError("");
    } else {
      setNameError("Name must be 18 characters or less");
    }
  };

  useEffect(() => {
    setIsFormValid(
      name !== "" &&
        selectedCategory !== "" &&
        introductions !== "" &&
        data !== "",
    );
  }, [name, selectedCategory, introductions, data]);

  const handleCreate = async () => {
    if (!isFormValid) return;
    setLoading(true);

    const aiData = {
      name: name,
      creator_address: wallet.address ?? "",
      category: selectedCategory,
      introductions: introductions,
      rag_contents: data,
      rag_comments: "CreateAI",
      profile_image_url: "",
      created_at: new Date().toISOString(),
      examples: "",
    };

    try {
      const res = await createAI(aiData);
      console.log("AI Created successfully", res);
      onAICreated();
    } catch (error) {
      console.error("Error creating AI:", error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const categories: string[] = [
    "Education",
    "Health & Fitness",
    "Entertainment",
    "Social networking",
    "Business",
    "Developer tools",
    "Graphics & Design",
    "Others",
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="w-full py-4 bg-primary-900 text-white hover:bg-primary-700 rounded-full flex items-center justify-center">
          <Plus className="mr-4" size={24} />
          Create Custom AI
        </button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="h-[calc(100vh-4rem)] p-0 border-t-0"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-xl font-semibold flex-grow text-center">
              Create Custom AI
            </h2>
          </div>

          <div className="flex-grow overflow-y-auto p-4 space-y-6">
            <div className="flex justify-center">
              <div className="relative size-20 bg-primary-900 rounded-full overflow-hidden">
                <input
                  type="file"
                  id="ai-image"
                  className="hidden"
                  accept="image/*"
                />
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
                className="block text-sm font-medium mb-1"
              >
                AI Name
              </label>
              <input
                type="text"
                id="nickname"
                className="w-full p-2 border-b bg-inherit border-gray-300 focus:border-primary-900 focus:outline-none"
                placeholder="Name your AI (max 18 characters)"
                onChange={handleNameChange}
                value={name}
                maxLength={18}
              />
              {nameError && (
                <p className="text-red-500 text-xs mt-1">{nameError}</p>
              )}
              <p className="text-[12px] p-2">
                Once created, the name cannot be changed.
              </p>
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
                      className={`px-4 text-primary-900 bg-primary-900 border-primary-900 border bg-opacity-10 rounded-full flex-shrink-0 transition-colors duration-200 ease-in-out ${
                        selectedCategory === categoryKey
                          ? "border border-primary-900"
                          : "border-opacity-10"
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border border-gray-700 py-2 px-3 bg-[#1F222A]">
                <h3 className="mb-2 pb-1 border-b border-gray-700">
                  Describe your AI
                </h3>
                <textarea
                  placeholder="Provide a brief first-person description."
                  className="w-full bg-transparent resize-none focus:outline-none"
                  rows={2}
                  onChange={(e) => setIntroductions(e.target.value)}
                />
              </div>

              <div className="rounded-lg border border-gray-700 py-2 px-3 bg-[#1F222A]">
                <h3 className="mb-2 pb-1 border-b border-gray-700">Data</h3>
                <div className="space-y-2">
                  <textarea
                    placeholder="Provide things to learn"
                    className="w-full bg-transparent focus:outline-none focus:border-primary-900"
                    rows={3}
                    onChange={(e) => setData(e.target.value)}
                  />
                </div>
              </div>

              <div className="rounded-lg border border-gray-700 py-2 px-3 bg-[#1F222A]">
                <h3 className=" mb-2 pb-1 border-b border-gray-700">
                  Examples
                </h3>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Provide an example to initiate the conversation"
                    className="w-full bg-transparent focus:outline-none focus:border-primary-900"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-4">
            <button
              className={`w-full py-4 rounded-full flex items-center justify-center transition-colors duration-200 ${
                isFormValid
                  ? "bg-primary-900 text-white hover:bg-primary-700"
                  : "bg-primary-900 bg-opacity-20 text-primary-900 cursor-not-allowed"
              }`}
              onClick={handleCreate}
              disabled={!isFormValid}
            >
              Create
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CreateCustomAISheet;
