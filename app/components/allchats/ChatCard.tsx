import { useAuth } from "@/app/context/useAuth";
import { handleError } from "@/app/helpers/errorHandler";
import { ChatModel } from "@/app/models/ChatModel";
import { MessageModel } from "@/app/models/MessageModel";
import { getChatById, getChatMessages } from "@/app/services/ChatService";
import React, { useEffect, useMemo, useState } from "react";

interface ChatCardProps {
  chat: ChatModel;
  lastMessage?: MessageModel



}

const ChatCard = ({ chat, lastMessage }: ChatCardProps) => {
  const { user } = useAuth();
  const [alternateChatName, setAlternateChatName] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<MessageModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // List of participants without the current user

  
  const chatParticipantsWithoutUser = useMemo(() => {
    return chat.participants.filter((p) => p.userId !== user?.userId);
  }, [chat.participants, user]);

  useEffect(() => {
    const getChatData = async () => {
      try {
        const response = await getChatById(chat.id);
        if (response && response.data) {
          setChatMessages(response.data.messages);
        }
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    };
    getChatData();
  }, []);



  useEffect(() => {
    if (chatParticipantsWithoutUser.length > 2) {
      setAlternateChatName(
        `${chatParticipantsWithoutUser[0].userName}, ${chatParticipantsWithoutUser[1].userName} and ${chatParticipantsWithoutUser.length - 2} others`
      );
    } else if (chatParticipantsWithoutUser.length === 2) {
      setAlternateChatName(
        `${chatParticipantsWithoutUser[0].userName} and ${chatParticipantsWithoutUser[1].userName}`
      );
    } else if (chatParticipantsWithoutUser.length === 1) {
      setAlternateChatName(chatParticipantsWithoutUser[0].userName);
    } else {
      setAlternateChatName("No participants");
    }

  }, [chatParticipantsWithoutUser]);

  const displayChatName = useMemo(() => {
    return chat.name ? chat.name : alternateChatName;
  }, [chat.name, alternateChatName]);

  return (
    <div className="bg-base-300 rounded-lg p-3 w-full cursor-pointer">
      <p className="font-bold">{displayChatName}</p>
      {isLoading ? (
      <p>Loading...</p>
    ) : lastMessage ? (
      <p>
        {`${lastMessage.sender.userName}: ${lastMessage.content}`}
      </p>
    ) : chatMessages.length > 0 ? (
      <p>{chatMessages[chatMessages.length - 1].sender.userName} : {chatMessages[chatMessages.length - 1].content}</p>
    ) : (
      <p>No messages yet</p>
    )}
  </div>
  );
};

export default ChatCard;


{/* <p>{`${chat.messages[chat.messages.length - 1].sender.userName} : ${chat.messages[chat.messages.length - 1].content}`}</p>} */}