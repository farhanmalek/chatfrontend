'use client'
import { useState, useEffect } from "react";
import { useDebounce } from "@/app/helpers/hooks";
import { getAllUsers } from "@/app/services/FriendService";
import { UserProfile } from "@/app/models/UserModel";
import FriendCard from "../FriendCard";
import Spinner from "@/app/loading/Spinner";

interface FriendMobileModalProps {
  setNewFriendModal: (arg0: boolean) => void;
}

const FriendMobileModal = ({ setNewFriendModal }: FriendMobileModalProps) => {
  const [input, setInput] = useState<string>("");
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const debouncedSearch = useDebounce(input);
  const [loading, setLoading] = useState<boolean>(false);

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
  }

  const fetchUsers = async () => {
    try {
      if (input.trim() !== "") {
        setLoading(true);
        const results = await getAllUsers(input);
        setSearchResults(results!.data);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [debouncedSearch]);

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-base-100 p-4 rounded-lg w-[85%] max-w-md h-[50%]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Find Friends</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={() => setNewFriendModal(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search for new friends..."
            className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            value={input}
            onChange={handleSearch}
          />
        </div>
        <div className="overflow-y-auto flex flex-col gap-3 py-2 max-h-[65%]">
          {input === "" ? (
            <p className="text-white p-3 italic text-center">Search for friends...</p>
          ) : (
            <>
              {loading ? (
                <div className="flex justify-center p-10">
                  <Spinner />
                </div>
              ) : (
                <>
                  {searchResults.length > 0 ? (
                    searchResults.map((user: UserProfile) => (
                      <FriendCard key={user.userId} user={user} action={"Add"} />
                    ))
                  ) : (
                    <p className="text-white p-3 italic text-center">No results found...</p>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default FriendMobileModal;
