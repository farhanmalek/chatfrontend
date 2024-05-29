import { ChatModel } from "@/app/models/ChatModel";
import { MessageModel } from "@/app/models/MessageModel";

interface ChatBubbleProps {
  message: MessageModel;
  self: boolean;
}

const ChatBubble = ({ message, self }: ChatBubbleProps) => {
  return (
    <div className={`chat ${self ? "chat-end" : "chat-start"}`}>
      <div className="chat-header">
        {message.sender.userName}
        <time className="text-xs opacity-50">{message.sentAt}</time>
      </div>
      <div className="chat-bubble">{message.content}</div>
    </div>
  );
};

export default ChatBubble;
