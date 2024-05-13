"use client"
import AllChats from "./components/allchats/AllChats";
import FriendModal from "./components/allchats/FriendModal";
import ChatBox from "./components/chatbox/ChatBox";
import Header from "./components/header/Header";
import { useState } from "react";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <>
    <Header/>
    <div className="px-3">
    <div className="flex h-[90vh]">
    <AllChats isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/>
    <ChatBox/>

    </div>
    {
      isModalOpen && <FriendModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/>
    }



  
  </div>
    </>

  );
}
