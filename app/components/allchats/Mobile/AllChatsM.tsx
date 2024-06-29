"use client";
import ChatCard from "../ChatCard";
import { IoMdAdd } from "react-icons/io";
import { IoMdPersonAdd } from "react-icons/io";
import { useEffect, useState } from "react";
import FriendCard from "../FriendCard";
import ChatMobileModal from "./ChatMobileModal";
import FriendMobileModal from "./FriendMobileModal";
import { useChat } from "@/app/context/chatContext";
import { ChatModel } from "@/app/models/ChatModel";
import { MessageModel } from "@/app/models/MessageModel";
import { getChatMessages } from "@/app/services/ChatService";
import { handleError } from "@/app/helpers/errorHandler";
import * as signalR from "@microsoft/signalr";
import { useAuth } from "@/app/context/useAuth";
import Spinner from "@/app/loading/Spinner";

interface ChatProps {
  setShowChat?: (arg0: boolean) => void;
  showChat?: boolean;
  selectedChat?: number | null;
  setSelectedChat?: (arg0: number | null) => void;
  alternateChatName?: string;
  setAlternateChatName?: (arg0: string) => void;
  messages: MessageModel[];
  setMessages: any;
  hubConnection: signalR.HubConnection | null;
  setHubConnection: (arg0: signalR.HubConnection | null) => void;
}

const AllChatsM = ({
  setShowChat,
  setSelectedChat,
  hubConnection,
  setMessages,
  setHubConnection,
}: ChatProps) => {
  const [newChatModal, setNewChatModal] = useState<boolean>(false);
  const [newFriendModal, setNewFriendModal] = useState<boolean>(false);
  const [lastMessages, setLastMessages] = useState<{
    [key: number]: MessageModel;
  }>({});
  const { chats, setChats, loading } = useChat();
  const { user } = useAuth();

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

  //handlechatselection
  const handleChatSelection = (chat: ChatModel) => {
    if (setSelectedChat) {
      setSelectedChat(chat.id);

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
          setTimeout(
            () => connection.start().catch((err) => console.log(err)),
            5000
          );
        });

      connection.on("ReceiveMessageByChatId", (user, message: MessageModel) => {
        setLastMessages((prev) => ({ ...prev, [chat.id]: message }));
        setMessages((prev: MessageModel[]) => [...prev, message]);
      });

      setHubConnection(connection);
    }
  };

  return (
    <div className="flex flex-col p-2 gap-3 rounded-md bg-secondary-content w-full">
      <div className="flex justify-between items-center">
        <p className="text-white font-bold text-2xl p-2">Chats</p>
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

      <div className="overflow-y-auto flex flex-col gap-2">
        {loading ? (
          <div className="flex flex-col items-center">
            <Spinner />
          </div>
        ) : (
          <>
            <div
              onClick={() => setShowChat && setShowChat(true)}
              className="flex flex-col gap-3"
            >
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
            </div>
          </>
        )}
      </div>
      {/* New Chat Modal */}
      {newChatModal && <ChatMobileModal setNewChatModal={setNewChatModal} />}
      {/* New Friend Modal */}
      {newFriendModal && (
        <FriendMobileModal setNewFriendModal={setNewFriendModal} />
      )}
    </div>
  );
};

export default AllChatsM;
