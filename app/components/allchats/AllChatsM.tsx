'use client'
import ChatCard from "./ChatCard";
import { IoMdAdd } from "react-icons/io";
import { IoMdPersonAdd } from "react-icons/io";
import { useState } from "react";
import FriendCard from "./FriendCard";

interface ChatProps {
  setShowChat?: (arg0: boolean) => void;
  showChat?: boolean;
}

const AllChatsM = ({ setShowChat, showChat }: ChatProps) => {
  const [newChatModal, setNewChatModal] = useState<boolean>(false);
  const [newFriendModal, setNewFriendModal] = useState<boolean>(false);

  return (
    <div className="flex flex-col p-2 gap-3 rounded-md bg-secondary-content w-full">
      <div className="flex justify-between items-center">
        <p className="text-white font-bold text-2xl">Chats</p>
        <div className="flex gap-2">
          <IoMdAdd
            className="self-center w-9 cursor-pointer"
            onClick={() => setNewChatModal(true)}
          />
          <IoMdPersonAdd
            className="self-center w-9 cursor-pointer"
            onClick={() => setNewFriendModal(true)}
          />
        </div>
      </div>
      <input
        type="text"
        placeholder="Search chats"
        className="input input-bordered w-full p-2"
      />
      <div className="overflow-y-auto flex flex-col gap-2">
        <div onClick={() => setShowChat && setShowChat(true)}>
          <ChatCard />
        </div>
      </div>
      {/* New Chat Modal */}
      {newChatModal && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
             <div className="bg-base-100 p-4 rounded-lg w-[85%] max-w-md h-[50%]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">New Chat</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={() => setNewChatModal(false)}
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
          />
        </div>
        <div className="overflow-y-auto flex flex-col gap-3 py-2 max-h-[65%]">
          <FriendCard />
          <FriendCard />
          <FriendCard />
          <FriendCard />
          <FriendCard />
          <FriendCard />
          <FriendCard />
        </div>
      </div>
        </div>
      )}
      {/* New Friend Modal */}
      {newFriendModal && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-base-100 p-4 rounded-lg w-[85%] max-w-md h-[50%]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Find Friends</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={() => setNewFriendModal(false)}
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
          />
        </div>
        <div className="overflow-y-auto flex flex-col gap-3 py-2 max-h-[65%]">
          <FriendCard />
          <FriendCard />
          <FriendCard />
          <FriendCard />
          <FriendCard />
          <FriendCard />
          <FriendCard />
        </div>
      </div>
        </div>
      )}
    </div>
  );
};

export default AllChatsM;
