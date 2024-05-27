'use client'
import ChatCard from "../ChatCard";
import { IoMdAdd } from "react-icons/io";
import { IoMdPersonAdd } from "react-icons/io";
import { useState } from "react";
import FriendCard from "../FriendCard";
import ChatMobileModal from "./ChatMobileModal";
import FriendMobileModal from "./FriendMobileModal";

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
        <ChatMobileModal setNewChatModal={setNewChatModal} />
      )}
      {/* New Friend Modal */}
      {newFriendModal && (
        <FriendMobileModal setNewFriendModal={setNewFriendModal} />
      )}
    </div>
  );
};

export default AllChatsM;
