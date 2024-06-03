
import { MessageModel } from "@/app/models/MessageModel";
import moment from "moment";


interface ChatBubbleProps {
  message: MessageModel;
  self: boolean;
}

const ChatBubble = ({ message, self }: ChatBubbleProps) => {

  const formattedDate = moment(message.sentAt).format('dddd, MMMM Do, YYYY h:mm A');

  return (
    <div className={`chat ${self ? "chat-end" : "chat-start"}`}>
      <div className="chat-header">
        {message.sender.userName} {' - '}
        <span className="text-xs opacity-50">{formattedDate}</span>
      </div>
      <div className="chat-bubble">{message.content}</div>
    </div>
  );
};

export default ChatBubble;
