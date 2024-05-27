"use client";
import AllChats from "./components/allchats/AllChats";
import AllChatsM from "./components/allchats/Mobile/AllChatsM";
import FriendModal from "./components/allchats/FriendModal";
import ChatBox from "./components/chatbox/ChatBox";
import Header from "./components/header/Header";
import { useEffect, useState } from "react";
import ProtectedRoute from "./helpers/ProtectedRoute";
import { useAuth } from "./context/useAuth";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showChat, setShowChat] = useState<boolean>(true);
  const {user, isLoggedIn} = useAuth();

  useEffect(() => {
    // Any state or data that should be reset when the user changes

  }, [user]);

if (!isLoggedIn) {
    return null;
  }
  
  return (
    <ProtectedRoute>
         <Header />
      <div className="px-3">
        <div className="md:flex h-[90vh] hidden ">
          <AllChats isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
          <ChatBox />
        </div>
        {/* Mobile View */}
        <div className="flex md:hidden h-[90vh]">
          {showChat ? (
            <ChatBox showChat={showChat} setShowChat={setShowChat} />
          ) : (
            <AllChatsM showChat={showChat} setShowChat={setShowChat} />
          )}
        </div>
        {isModalOpen && (
          <FriendModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          />
        )}
      </div>
    </ProtectedRoute>
   
   
  );
}
