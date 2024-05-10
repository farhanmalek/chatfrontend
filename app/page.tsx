import AllChats from "./components/allchats/AllChats";
import ChatBox from "./components/chatbox/ChatBox";
import Header from "./components/header/Header";
import Login from "./components/login/Login";
import Register from "./components/register/Register";


export default function Home() {

  return (
    <>
    <Header/>
    <div className="px-3">
    <div className="flex h-[90vh]">
    <AllChats/>
    <ChatBox/>

    </div>



  
  </div>
    </>

  );
}
