"use client";
import { useEffect, useState } from "react";
import FriendCard from "./FriendCard";
import { UserProfile } from "@/app/models/UserModel";
import { getFriends } from "@/app/services/FriendService";
import { createChat } from "@/app/services/ChatService";
import { toast } from "react-toastify";
import Spinner from "@/app/loading/Spinner";

interface ModalProps {
  setIsModalOpen: (arg0: boolean) => void;
  isModalOpen: boolean;
}

const FriendModal = ({ setIsModalOpen, isModalOpen }: ModalProps) => {
  const [friends, setFriends] = useState<UserProfile[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [chatParticipantList, setChatParticipantList] = useState<UserProfile[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Fetch friends when the component mounts or searchInput changes
    const fetchFriends = async () => {
      try {
        const response = await getFriends(searchInput);
        setFriends(response!.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch friends", error);
      }
    };
    setLoading(true);
    fetchFriends();
  }, [searchInput]);

  //Create the chat
  const handleChatCreation = async () => {
    try {
      await createChat(chatParticipantList);
      toast.success("Chat created successfully");
      setIsModalOpen(!isModalOpen);
      setChatParticipantList([]);
    } catch (error) {
      console.error("Failed to create chat", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50 gap-2">
      <div className="bg-base-100 p-4 rounded-lg w-full max-w-md h-[50%] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Create Chat</h2>
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
          {loading ? (
            <div className="flex justify-center p-10">
              <Spinner />
            </div>
          ) : (
            <>
              {friends.map((friend) => (
                <FriendCard
                  key={friend.userId}
                  user={friend}
                  action="Message"
                  chatParticipantList={chatParticipantList}
                  setChatParticipantList={setChatParticipantList}
                />
              ))}
            </>
          )}
        </div>
        {chatParticipantList.length > 0 && (
          <button className="btn self-end mt-20" onClick={handleChatCreation}>
            Create Chat
          </button>
        )}
      </div>
    </div>
  );
};

export default FriendModal;
