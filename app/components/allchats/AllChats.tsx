import ChatCard from "./ChatCard";

const AllChats = () => {
  return (
    <div className="flex flex-col gap-3 p-4 rounded-md bg-secondary-content">
      <p className="text-white font-bold text-2xl">Chats</p>
      <input
        type="text"
        placeholder="Search chats"
        className="input input-bordered w-full max-w-xs p-2"
      />
      <div className="overflow-y-auto flex flex-col gap-2">
        <ChatCard />
      </div>
    </div>
  );
};

export default AllChats;
