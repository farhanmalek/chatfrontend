import React, { createContext, useContext, useEffect, useState } from "react";
import { UserProfile } from "../models/UserModel";
import { ChatModel } from "../models/ChatModel";
import { createChat, getAllChats } from "../services/ChatService";
import { toast } from "react-toastify";

type ChatContextType = {
    handleNewChat: (participants: UserProfile[]) => Promise<void>;
    chats: ChatModel[];
    refetchChats: () => void;
};

const ChatContext = createContext<ChatContextType>({} as ChatContextType);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
    const [chats, setChats] = useState<ChatModel[]>([] as ChatModel[]);

    const handleNewChat = async (participants: UserProfile[]) => {
        try {
            const response = await createChat(participants);
            if (response && response.data) {
                setChats((prevChats) => [...prevChats, response.data]);
            }
        } catch (error) {
            toast.warning("Server Error Occurred");
        }
    };

    const refetchChats = async () => {
        try {
            const response = await getAllChats();
            if (response && response.data) {
                // Sort the messages within each chat
                const sortedChats = response.data.map((chat: ChatModel) => {
                  const sortedMessages = chat.messages.sort((a, b) => Date.parse(a.sentAt!) - Date.parse(b.sentAt!));
                  return { ...chat, messages: sortedMessages };
                });
          
                setChats(sortedChats);
              }
        } catch (error) {
            toast.warning("Server Error Occurred");
        }
    };

    useEffect(() => {
        refetchChats();
    }, []);

    return (
        <ChatContext.Provider value={{ handleNewChat, chats, refetchChats }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);
