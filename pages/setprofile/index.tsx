import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import CountrySelect from "@/components/setprofile/CountrySelect";
import { UserRound } from "lucide-react";
import { addUser } from "@/utils/api/user";
import GenderSelect from "@/components/setprofile/GenderSelect";
import { useUserStore } from "@/store/userStore";
import { useWallet } from "@suiet/wallet-kit";
import { User } from "@/utils/interface";
import Image from "next/image";

const SetProfilePage = () => {
  const [selectedProfile, setSelectedProfile] = useState(0);
  const [nickname, setNickname] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const [interest, setInterest] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const wallet = useWallet();

  const setUser = useUserStore((state) => state.setUser);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value.replace(/\s+/g, "_");
    setNickname(newName);
  };

  const profileImages = [
    "https://suietail.s3.ap-southeast-2.amazonaws.com/1.png",
    "https://suietail.s3.ap-southeast-2.amazonaws.com/2.png",
    "https://suietail.s3.ap-southeast-2.amazonaws.com/3.png",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!wallet || !wallet.address) {
      setError("Wallet address is not available");
      setIsLoading(false);
      return;
    }

    try {
      const userData: User = {
        user_address: wallet.address,
        nickname,
        profile_image_url:
          selectedProfile > 0 ? profileImages[selectedProfile - 1] : "",
        gender,
        country,
        interest,
      };

      console.log("Creating user profile:", userData);

      const result = await addUser(userData);
      console.log("User profile created:", result);

      // store에 저장
      setUser(result);
      router.push("/explore");
    } catch (error) {
      setError("Failed to create profile. Please try again.");
      console.error("Error creating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-[600px] min-h-screen mx-auto bg-[#1F222A] flex flex-col px-6 text-white">
      <div className="py-4 flex-shrink-0">
        <div className="text-3xl text-white font-bold mb-4">
          Complete your profile
        </div>
        <p className="text-lg text-gray-400 mb-8">Select a profile picture!</p>
      </div>

      <div className="flex-grow overflow-y-auto pb-4">
        <div className="size-32 bg-[#2A2D36] rounded-full mb-4 mx-auto flex items-center justify-center overflow-hidden">
          {selectedProfile === 0 ? (
            <UserRound className="text-gray-400 size-24" />
          ) : (
            <Image
              src={profileImages[selectedProfile - 1]}
              alt="Selected profile"
              width={128}
              height={128}
              className="object-cover transform scale-150 translate-y-[-10%]"
            />
          )}
        </div>

        <div className="flex justify-center space-x-4 mb-8">
          {profileImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedProfile(index + 1)}
              className={`size-16 rounded-full overflow-hidden border-2 bg-[#2A2D36] ${
                selectedProfile === index + 1
                  ? "border-primary-900"
                  : "border-transparent"
              }`}
            >
              <Image
                src={img}
                alt={`Profile ${index + 1}`}
                width={64}
                height={64}
                className="object-cover transform scale-150 translate-y-[-10%]"
              />
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="nickname"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Nickname
            </label>
            <input
              type="text"
              id="nickname"
              value={nickname}
              onChange={handleNameChange}
              className="w-full p-2 border-b border-gray-600 focus:border-primary-900 focus:outline-none bg-transparent text-white"
              placeholder="Name"
              required
            />
          </div>

          <GenderSelect value={gender} onChange={setGender} />
          <CountrySelect value={country} onChange={setCountry} />

          <div>
            <label
              htmlFor="interest"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Field of Interest
            </label>
            <div className="flex">
              <input
                type="text"
                id="interest"
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                className="flex-1 p-2 border-b border-gray-600 focus:border-primary-900 focus:outline-none bg-transparent text-white"
                placeholder="Education, Fitness, Blockchain etc..."
              />
            </div>
          </div>

          {error && <p className="text-red-500">{error}</p>}

          <div className="pb-6 flex-shrink-0">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-900 text-white py-4 rounded-full font-medium disabled:bg-gray-600"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetProfilePage;
