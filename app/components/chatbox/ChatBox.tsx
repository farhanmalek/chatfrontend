"use client"
import ChatBubble from "./ChatBubble";
import { IoMdArrowRoundBack } from "react-icons/io";


interface ChatProps {
  setShowChat?: (arg0: boolean) => void
  showChat?: boolean
}

const ChatBox = ({setShowChat,showChat}:ChatProps) => {

  return (

    <div className="flex-grow pl-2 gap-1 flex flex-col">
      <div className="navbar bg-base-100 border-b-2">
        <div className="flex-1">
        {setShowChat && <IoMdArrowRoundBack className="md:hidden" onClick={() => setShowChat(false)}/>}
          <a className="btn btn-ghost text-xl">The United Nations V2</a>
        </div>
        <div className="flex-none">
          <button className="btn btn-square btn-ghost">
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
          </button>
        </div>
      </div>
      <div className="flex-grow h-[85%]">
        <ChatBubble/>
      </div>
      <div className="flex gap-2">
      <input type="text" placeholder="Send Message..." className="input input-bordered flex-grow" />
      <button className="btn btn-neutral">Send</button>

      </div>
      

    </div>
  );
};

export default ChatBox;
