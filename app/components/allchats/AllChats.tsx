'use client'
import ChatCard from "./ChatCard";
import { IoMdAdd } from "react-icons/io";


interface ModalProps {
  setIsModalOpen: (arg0: boolean) => void
  isModalOpen: boolean
}

const AllChats = ({isModalOpen,setIsModalOpen}: ModalProps) => {


  return (
    <>
        <div className="md:flex flex-col p-2 gap-3 rounded-md bg-secondary-content hidden ">
      <div className="flex justify-between">
        <p className="text-white font-bold text-2xl">Chats</p>
      
       <IoMdAdd className="self-center w-9" onClick={() => {
        setIsModalOpen(!isModalOpen)
       }}/>

      </div>
      <input
        type="text"
        placeholder="Search chats"
        className="input input-bordered w-full max-w-xs p-2"
      />
      <div className="overflow-y-auto flex flex-col gap-2">
        <ChatCard />
      </div>
    </div>
    </>

  );
};

export default AllChats;
