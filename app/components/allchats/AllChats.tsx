import { useChat } from "@/app/context/chatContext";
import ChatCard from "./ChatCard";
import { IoMdAdd } from "react-icons/io";
import { ChatModel } from "@/app/models/ChatModel";
import * as signalR from "@microsoft/signalr";
import { getChatMessages } from "@/app/services/ChatService";
import { handleError } from "@/app/helpers/errorHandler";
import { MessageModel } from "@/app/models/MessageModel";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/useAuth";
import Spinner from "@/app/loading/Spinner";

interface ModalProps {
  setIsModalOpen: (arg0: boolean) => void;
  isModalOpen: boolean;
  selectedChat?: number | null;
  setSelectedChat?: (arg0: number | null) => void;
  messages: MessageModel[];
  setMessages: any;
  hubConnection: signalR.HubConnection | null;
  setHubConnection: (arg0: signalR.HubConnection | null) => void;
}

const AllChats = ({
  setIsModalOpen,
  isModalOpen,
  setSelectedChat,
  hubConnection,
  setMessages,
  setHubConnection,
  messages,
}: ModalProps) => {
  const { chats, setChats, loading } = useChat();
  const { user } = useAuth();
  const [lastMessages, setLastMessages] = useState<{
    [key: number]: MessageModel;
  }>({});

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5148/allchat")
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connection.on("ReceiveLastMessageUpdate", (chatId, message) => {
      setLastMessages((prev) => ({ ...prev, [chatId]: message }));
    });

    connection
      .start()
      .then(() => console.log("SignalR ChatCardHub Connected."))
      .catch((err) => {
        setTimeout(
          () => connection.start().catch((err) => console.log(err)),
          5000
        );
      });

    return () => {
      connection.stop();
    };
  }, []);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`http://localhost:5148/createdchats?userId=${user?.userId}`)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connection.on("NewChatCreated", (chat: ChatModel) => {
      setChats((prev) => [chat, ...prev]);
    });

    connection
      .start()
      .then(() => console.log("SignalR ChatCardHub Connected."))
      .catch((err) => {
        setTimeout(
          () => connection.start().catch((err) => console.log(err)),
          5000
        );
      });

    return () => {
      connection.stop();
    };
  }, []);

  const handleChatSelection = async (chat: ChatModel) => {
    if (setSelectedChat) {
      setSelectedChat(chat.id);

      try {
        const response = await getChatMessages(chat.id);
        if (response && response.data) {
          setMessages(response.data);
        }
      } catch (error) {
        handleError(error);
      }

      if (hubConnection) {
        hubConnection.stop();
        setHubConnection(null);
      }

      const chatConnection = new signalR.HubConnectionBuilder()
        .withUrl(`http://localhost:5148/chat?chatId=${chat.id}`)
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build();

      chatConnection
        .start()
        .then(() => console.log("SignalR Connected."))
        .catch((err) => {
          setTimeout(
            () => chatConnection.start().catch((err) => console.log(err)),
            5000
          );
        });

      chatConnection.on(
        "ReceiveMessageByChatId",
        (user, message: MessageModel) => {
          setMessages((prev: MessageModel[]) => [...prev, message]);
        }
      );

      setHubConnection(chatConnection);
    }
  };

  return (
    <div className="md:flex flex-col p-2 gap-3 rounded-md bg-secondary-content hidden w-[20%] ">
      <div className="flex justify-between">
        <p className="text-white font-bold text-2xl p-2">Chats</p>
        <IoMdAdd
          className="self-center w-9 cursor-pointer"
          onClick={() => setIsModalOpen(!isModalOpen)}
        />
      </div>
      <div className="overflow-y-auto flex flex-col gap-2">
        {loading ? (
          <div className="flex flex-col items-center">
            <Spinner />
          </div>
        ) : (
          <>
            {chats.length === 0 ? (
              <p className="text-center">No chats...</p>
            ) : (
              Array.from(new Set(chats.map((chat) => chat.id))).map((id) => {
                const chat = chats.find((c) => c.id === id); // Find the chat object by id
                return (
                  <div
                    key={chat!.id}
                    onClick={() => handleChatSelection(chat!)}
                  >
                    <ChatCard
                      chat={chat!}
                      lastMessage={lastMessages[chat!.id]}
                    />
                  </div>
                );
              })
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllChats;
