'use client'
import { useChat } from "@/app/context/chatContext";
import ChatCard from "./ChatCard";
import { IoMdAdd } from "react-icons/io";
import { ChatModel } from "@/app/models/ChatModel";
import * as signalR from "@microsoft/signalr";
import { getChatMessages } from "@/app/services/ChatService";
import { handleError } from "@/app/helpers/errorHandler";
import { MessageModel } from "@/app/models/MessageModel";


interface ModalProps {
  setIsModalOpen: (arg0: boolean) => void
  isModalOpen: boolean
  selectedChat?: number | null
  setSelectedChat?: (arg0: number | null) => void
  alternateChatName?: string
  setAlternateChatName?: (arg0: string) => void
  messages: MessageModel[]
  setMessages: any
  hubConnection: signalR.HubConnection | null
  setHubConnection: (arg0: signalR.HubConnection | null) => void
}

const AllChats = ({isModalOpen,setIsModalOpen, setSelectedChat, hubConnection,setMessages,setHubConnection}: ModalProps) => {
  const {chats} = useChat()

  //handle chat selection
  //when the chat is selected, get all the messages for that chat and setup the signal r connection for it
  const handleChatSelection = (chat: ChatModel) => {
    if (setSelectedChat) {
      setSelectedChat(chat.id)

      //get all messages for the selected chat
      const getAllMessages = async () => {
        try {
          if (chat) {
            const response = await getChatMessages(chat.id);
            if (response && response.data) {
              setMessages(response.data);
            }
          }
        } catch (error) {
          handleError(error);
        }
      };
      getAllMessages();

      //setup signal r connection
      //if a connection exists close it first
      if (hubConnection) {
        hubConnection.stop();
        setHubConnection(null);
      }

      const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5148/chat?chatId=" + chat.id)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connection
      .start()
      .then(() => console.log("SignalR Connected."))
      .catch((err) => {
        console.log("Error while establishing connection: ", err);
        setTimeout(() => connection.start().catch((err) => console.log(err)), 5000);
      });

        connection.on("ReceiveMessageByChatId", (user, message: MessageModel) => {
          console.log("hit")
          setMessages((prev:MessageModel[]) => [...prev, message]);
          console.log("messages",message)
        });
      
      
      
      setHubConnection(connection);

      
    }
  }

  return (
    <>
        <div className="md:flex flex-col p-2 gap-3 rounded-md bg-secondary-content hidden w-[20%] ">
      <div className="flex justify-between">
        <p className="text-white font-bold text-2xl">Chats</p>
      
       <IoMdAdd className="self-center w-9" onClick={() => {
        setIsModalOpen(!isModalOpen)
       }}/>

      </div>
      <input
        type="text"
        placeholder="Search chats"
        className="input input-bordered w-full p-2"
      />
      <div className="overflow-y-auto flex flex-col gap-2">
        {
          chats.length === 0 ? <p className="text-white">No chats</p> :
          chats.map(chat => (
            <div key={chat.id} onClick={() => handleChatSelection(chat)}><ChatCard chat={chat}  /></div>
          ))
        }
      </div>
    </div>
    </>

  );
};

export default AllChats;
