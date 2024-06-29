"use client";
import { ChatModel } from "@/app/models/ChatModel";
import ChatBubble from "./ChatBubble";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@/app/context/chatContext";
import { useAuth } from "@/app/context/useAuth";
import ChatDropDown from "./ChatDropDown";
import {
  changeChatName,
  getChatById,
  getChatMessages,
} from "@/app/services/ChatService";
import { handleError } from "@/app/helpers/errorHandler";
import { MessageModel } from "@/app/models/MessageModel";
import * as signalR from "@microsoft/signalr";
import LoadingBars from "@/app/loading/LoadingBars";

interface ChatProps {
  setShowChat?: (arg0: boolean) => void;
  showChat?: boolean;
  selectedChat?: number | null;
  messages: MessageModel[];
  setMessages: any;
  hubConnection: signalR.HubConnection | null;
}

const ChatBox = ({
  setShowChat,
  selectedChat,
  messages,
  hubConnection,
}: ChatProps) => {
  const { refetchChats } = useChat(); // get all chats
  const { user } = useAuth();
  const [chatData, setChatData] = useState<ChatModel | null>(null);
  const [altChatName, setAltChatName] = useState<string>("");
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  const [editChatName, setEditChatName] = useState<boolean>(false);
  const [newChatName, setNewChatName] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const chatBoxRef = useRef<HTMLDivElement>(null);

  const [forceUpdateKey, setForceUpdateKey] = useState(0);

  const sendMessage = async () => {
    const newMessage: MessageModel = {
      chatId: selectedChat!,
      content: content,
      sender: user!,
    };
    if (content.trim() === "") return;
    try {
      await hubConnection?.invoke(
        "SendMessageByChatId",
        user!,
        newMessage,
        selectedChat!
      );
      setContent("");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchChatDetails = async () => {
      setLoading(true);
      try {
        if (selectedChat) {
          const response = await getChatById(selectedChat);
          if (response && response.data) {
            setChatData(response.data);
            setLoading(false);
          }
        }
      } catch (error) {
        handleError(error);
      }
    };
    fetchChatDetails();
  }, [selectedChat, forceUpdateKey]);

  const chatParticipantsWithoutUser = useMemo(() => {
    if (!chatData) return [];
    return chatData.participants.filter((p) => p.userId !== user?.userId);
  }, [chatData, user]);

  useEffect(() => {
    if (chatParticipantsWithoutUser.length > 2) {
      setAltChatName(
        `${chatParticipantsWithoutUser[0].userName}, ${
          chatParticipantsWithoutUser[1].userName
        } and ${chatParticipantsWithoutUser.length - 2} others`
      );
    } else if (chatParticipantsWithoutUser.length === 2) {
      setAltChatName(
        `${chatParticipantsWithoutUser[0].userName} and ${chatParticipantsWithoutUser[1].userName}`
      );
    } else if (chatParticipantsWithoutUser.length === 1) {
      setAltChatName(chatParticipantsWithoutUser[0].userName);
    }
  }, [chatParticipantsWithoutUser]);

  const handleDropDown = () => {
    setShowDropDown(!showDropDown);
  };

  const handleSaveChatName = async () => {
    try {
      const response = await changeChatName(chatData!.id, newChatName);
      if (response && response.data) {
        setEditChatName(false);
        setForceUpdateKey((prevKey) => prevKey + 1);
      }
      refetchChats();
      setNewChatName("");
    } catch (error) {
      handleError(error);
    }
  };

  // Use useEffect to scroll to bottom when messages change

  const chatEndRef = useRef<any>();

  // Function to scroll to bottom
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-grow pl-2 gap-1 flex flex-col">
      {loading ? (
        <div className="flex justify-center p-10">
        <LoadingBars />
        </div>

      ) : (
        <>
          <div className="navbar bg-base-100 border-b-2">
            <div className="flex-1">
              {setShowChat && (
                <IoMdArrowRoundBack
                  className="md:hidden"
                  onClick={() => setShowChat(false)}
                />
              )}
              <div className="flex items-center">
                {editChatName ? (
                  <>
                    <input
                      type="text"
                      className="input input-bordered"
                      placeholder="Enter chat name"
                      value={newChatName}
                      onChange={(e) => setNewChatName(e.target.value)}
                    />
                    <button
                      className="btn btn-primary ml-2"
                      onClick={handleSaveChatName}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-ghost ml-2"
                      onClick={() => setEditChatName(false)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <span className="btn btn-ghost text-xl" key={forceUpdateKey}>
                    {chatData?.name || altChatName}
                  </span>
                )}
              </div>
            </div>
            <div className="flex-none">
              <button
                className="btn btn-square btn-ghost relative flex flex-col"
                onClick={handleDropDown}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-5 h-5 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                  ></path>
                </svg>
                {showDropDown && (
                  <ChatDropDown
                    editChatName={editChatName}
                    setEditChatName={setEditChatName}
                  />
                )}
              </button>
            </div>
          </div>
          <div className="flex-grow h-[85%]" ref={chatBoxRef}>
            {chatData && (
              <div className="flex flex-col h-full overflow-y-scroll">
                {messages.map((message, index) =>
                  message.sender.userId === user?.userId ? (
                    <ChatBubble key={index} message={message} self={true} />
                  ) : (
                    <ChatBubble key={index} message={message} self={false} />
                  )
                )}
                <div ref={chatEndRef} />
              </div>
            )
          
          }
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Send Message..."
              className="input input-bordered flex-grow"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && content.trim() !== "") {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <button
              className="btn btn-neutral"
              type="button"
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatBox;
