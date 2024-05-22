'use client'
import { useEffect, useState } from "react";
import FriendCard from "./FriendCard";
import { UserProfile } from "@/app/models/UserModel";
import { getFriends } from "@/app/services/FriendService";

interface ModalProps {
  setIsModalOpen: (arg0: boolean) => void;
  isModalOpen: boolean;
}

const FriendModal = ({ setIsModalOpen, isModalOpen }: ModalProps) => {
  const [friends, setFriends] = useState<UserProfile[]>([]);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    // Fetch friends when the component mounts or searchInput changes
    const fetchFriends = async () => {
      try {
        const response = await getFriends(searchInput);
        setFriends(response!.data);
      } catch (error) {
        console.error("Failed to fetch friends", error);
      }
    };

    fetchFriends();
  }, [searchInput]);

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50 gap-2">
      <div className="bg-base-100 p-4 rounded-lg w-full max-w-md h-[50%]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Find Friends</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={() => setIsModalOpen(!isModalOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search friends..."
            className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <div className="overflow-y-auto flex flex-col gap-3 py-2 max-h-[65%]">
          {friends.map((friend) => (
            <FriendCard key={friend.userId} user={friend} action="Message" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FriendModal;
