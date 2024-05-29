"use client";
import AllChats from "./components/allchats/AllChats";
import AllChatsM from "./components/allchats/Mobile/AllChatsM";
import FriendModal from "./components/allchats/FriendModal";
import ChatBox from "./components/chatbox/ChatBox";
import Header from "./components/header/Header";
import { useEffect, useState } from "react";
import ProtectedRoute from "./helpers/ProtectedRoute";
import { useAuth } from "./context/useAuth";
import { ChatProvider } from "./context/chatContext";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showChat, setShowChat] = useState<boolean>(true);
  const { user, isLoggedIn } = useAuth();
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [alternateChatName, setAlternateChatName] = useState<string>("");

  useEffect(() => {
    // Any state or data that should be reset when the user changes
  }, [user]);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <ProtectedRoute>
      <Header />
      <ChatProvider>
        <div className="px-3">
          <div className="md:flex h-[90vh] hidden ">
            <AllChats
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              selectedChat={selectedChat}
              setSelectedChat={setSelectedChat}
    
            />
            {
              // If selected chat is null, show a message
              selectedChat === null ? (
                <div className="flex-grow bg-secondary-content rounded-md p-5 ml-2">
                  <p className="text-white text-center">Select a chat to view messages</p>
                </div>
              ) : <ChatBox selectedChat ={selectedChat} />
            }
          </div>
          {isModalOpen && (
            <FriendModal
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
            />
          )}
          {/* Mobile View */}
          <div className="flex md:hidden h-[90vh]">
            {showChat ? (
              <ChatBox showChat={showChat} setShowChat={setShowChat} />
            ) : (
              <AllChatsM showChat={showChat} setShowChat={setShowChat} />
            )}
          </div>
        </div>
      </ChatProvider>
    </ProtectedRoute>
  );
}
