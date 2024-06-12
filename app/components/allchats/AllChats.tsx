'use client'
import { useChat } from "@/app/context/chatContext";
import ChatCard from "./ChatCard";
import { IoMdAdd } from "react-icons/io";
import { ChatModel } from "@/app/models/ChatModel";
import * as signalR from "@microsoft/signalr";
import { getAllChats, getChatMessages } from "@/app/services/ChatService";
import { handleError } from "@/app/helpers/errorHandler";
import { MessageModel } from "@/app/models/MessageModel";
import { useEffect, useState } from "react";


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

const AllChats = ({isModalOpen,setIsModalOpen, setSelectedChat, hubConnection,setMessages,setHubConnection, messages}: ModalProps) => {
  const {chats} = useChat()
  const [lastMessages, setLastMessages] = useState<{ [key: number]: MessageModel }>({});

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
        .withUrl("http://localhost:5148/allchat")
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build();

    connection.on("ReceiveLastMessageUpdate", (chatId, message) => {
        setLastMessages(prev => ({ ...prev, [chatId]: message }));
    });

    connection.start()
        .then(() => console.log("SignalR ChatCardHub Connected."))
        .catch((err) => {
            setTimeout(() => connection.start().catch(err => console.log(err)), 5000);
        });

    return () => {
        connection.stop();
    };
}, []);

  
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
        setTimeout(() => connection.start().catch((err) => console.log(err)), 5000);
      });

        connection.on("ReceiveMessageByChatId", (user, message: MessageModel) => {
          // setLastMessages((prev) => ({ ...prev, [chat.id]: message }));
          setMessages((prev:MessageModel[]) => [...prev,  message]);
       
        });
      
      
      
      setHubConnection(connection);

      
    }
  }


  return (
    <>
        <div className="md:flex flex-col p-2 gap-3 rounded-md bg-secondary-content hidden w-[20%] ">
      <div className="flex justify-between">
        <p className="text-white font-bold text-2xl p-2">Chats</p>
      
       <IoMdAdd className="self-center w-9" onClick={() => {
        setIsModalOpen(!isModalOpen)
       }}/>

      </div>
      <div className="overflow-y-auto flex flex-col gap-2">
        {
          chats.length === 0 ? <p className="text-white">No chats</p> :
          chats.map(chat => (
            <div key={chat.id} onClick={() => handleChatSelection(chat)}><ChatCard chat={chat} lastMessage={lastMessages[chat.id]} /></div>
          ))
        }
      </div>
    </div>
    </>

  );
};

export default AllChats;
