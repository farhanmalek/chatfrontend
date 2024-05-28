import { useAuth } from "@/app/context/useAuth";
import { ChatModel } from "@/app/models/ChatModel";
import React, { useEffect, useState, useMemo } from "react";

interface ChatCardProps {
  chat: ChatModel;
}

const ChatCard = ({ chat }: ChatCardProps) => {
  const [alternateChatName, setAlternateChatName] = useState<string>("");
  const { user } = useAuth();

  // List of participants without the current user
  const chatParticipantsWithoutUser = useMemo(() => {
    return chat.participants.filter((p) => p.userId !== user?.userId);
  }, [chat.participants, user]);

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
    return chat.chatName ? chat.chatName : alternateChatName;
  }, [chat.chatName, alternateChatName]);

  return (
    <div className="bg-base-300 rounded-lg p-3 w-full">
      <p className="font-bold">{displayChatName}</p>
      <p>Last Message</p>
    </div>
  );
};

export default ChatCard;
