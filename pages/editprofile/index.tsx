import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import CountrySelect from "@/components/setprofile/CountrySelect";
import { UserRound } from "lucide-react";
import { updateUser } from "@/utils/api/user";
import GenderSelect from "@/components/setprofile/GenderSelect";
import { useWallet } from "@suiet/wallet-kit";
import { useUserStore } from "@/store/userStore";
import Image from "next/image";

const EditProfilePage = () => {
  const [selectedProfile, setSelectedProfile] = useState(0);
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const [interest, setInterest] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const wallet = useWallet();

  const { user, setUser } = useUserStore();

  const profileImages = [
    "https://suietail.s3.ap-southeast-2.amazonaws.com/1.png",
    "https://suietail.s3.ap-southeast-2.amazonaws.com/2.png",
    "https://suietail.s3.ap-southeast-2.amazonaws.com/3.png",
  ];

  useEffect(() => {
    if (user) {
      setGender(user.gender || "");
      setCountry(user.country || "");
      setInterest(user.interest || "");
      if (user.profile_image_url) {
        const index = profileImages.findIndex(
          (img) => img === user.profile_image_url
        );
        setSelectedProfile(index !== -1 ? index : 0);
      }
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!user || !user.user_address) {
      setError("Wallet address is not available");
      setIsLoading(false);
      return;
    }

    try {
      const userData = {
        user_address: user.user_address,
        trial: user.trial,
        profile_image_url:
          selectedProfile !== -1 ? profileImages[selectedProfile] : "",
        gender,
        country,
        interest,
      };
      const result = await updateUser(userData);
      console.log("User profile updated:", result);
      setUser(result);
      router.push("/mypage");
    } catch (error) {
      setError("Failed to update profile. Please try again.");
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-[600px] mx-auto flex flex-col text-white">
      <div className="flex-shrink-0">
        <p className="text-lg text-gray-400 mb-8">
          Update your profile information
        </p>
      </div>

      <div className="flex-grow overflow-y-auto pb-4">
        <div className="w-32 h-32 bg-[#2A2D36] rounded-full mb-4 mx-auto flex items-center justify-center overflow-hidden">
          {selectedProfile === -1 ? (
            <UserRound className="text-gray-400 w-24 h-24" />
          ) : (
            <Image
              src={profileImages[selectedProfile]}
              alt="Selected profile"
              width={128}
              height={128}
              className="object-cover"
            />
          )}
        </div>

        <div className="flex justify-center space-x-4 mb-8">
          {profileImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedProfile(index)}
              className={`w-16 h-16 rounded-full overflow-hidden border-2 bg-[#2A2D36] ${
                selectedProfile === index
                  ? "border-primary-900"
                  : "border-transparent"
              }`}
            >
              <Image
                src={img}
                alt={`Profile ${index + 1}`}
                width={64}
                height={64}
                className="object-cover"
              />
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
              {isLoading ? "Updating Profile..." : "Update Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;

export async function getStaticProps() {
  return {
    props: {
      title: "Edit Profile",
    },
  };
}
