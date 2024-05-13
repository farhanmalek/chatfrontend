const ChatBubble = () => {
  return (
    <div>
      <div className="chat chat-start">
        <div className="chat-header">
          Name of sender
          <time className="text-xs opacity-50"> 2 hours ago</time>
        </div>
        <div className="chat-bubble">Message</div>
      </div>
    </div>
  );
};

export default ChatBubble;
