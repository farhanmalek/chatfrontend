import React, { useState, useEffect, useRef } from "react";
import SearchCard from "./SearchCard";
import { useAuth } from "@/app/context/useAuth";
import { UserProfile } from "@/app/models/UserModel";
import { getAllUsers, pendingFriendRequests } from "@/app/services/FriendService";
import { useDebounce } from "@/app/helpers/hooks";
import FriendRequestModal from "./FriendRequestModal";
import * as signalR from "@microsoft/signalr";
import { toast } from "react-toastify";
import { FaCog } from "react-icons/fa";


const Header = () => {
  const [input, setInput] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<UserProfile[]>(
    [] as UserProfile[]
  );
  const [friendRequestModal, setFriendRequestModal] = useState<boolean>(false);
  const [pendingRequests, setPendingRequests] = useState<UserProfile[]>([] as UserProfile[]);
  const debouncedSearch = useDebounce(input);
  const searchRef = useRef<HTMLInputElement>(null);
  const friendRequstRef = useRef<HTMLDivElement>(null);
  const {user} = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [searchLoading, setSearchLoading] = useState<boolean>(false); 

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setModalOpen(false);
      }

      if (
        friendRequstRef.current &&
        !friendRequstRef.current.contains(event.target as Node)
      ) {
        setFriendRequestModal(false);
      }




    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    getPendingRequests();
  }, []);


  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5148/friend?userId=" + user?.userId)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connection.on("ReceiveFriendRequest", (request: UserProfile) => {
      setPendingRequests((prev) => [...prev, request]);
    });

    connection.on("Response", (responder:UserProfile) => {
      toast.success(`${responder.userName} has accepted your friend request!`);

    });


    connection
      .start()
      .then(() => console.log("SignalR FriendRequestHub Connected."))
      .catch((err) => {
        setTimeout(
          () => connection.start().catch((err) => console.log(err)),
          5000
        );
      });

    return () => {
      connection.stop();
    };
  }, []);

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
  }

  function handleModal() {
    setModalOpen(!modalOpen);
    setFriendRequestModal(false);
  }

  function openFriendRequestModal() {
    setFriendRequestModal(!friendRequestModal);
    setModalOpen(false);
  }

  //Handle Logout
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const fetchUsers = async () => {
    if (input !== "") {
      setSearchLoading(true);
      const results = await getAllUsers(input);
      setSearchResults(results!.data);
      setSearchLoading(false);
    } else if (input === "") {
      setSearchResults([]);
    }
  };

  //make api call to fetch pending friend requests
  const getPendingRequests = async () => {
    setLoading(true);
    const requests = await pendingFriendRequests();
    setPendingRequests(requests!.data);
    setLoading(false);
  }

  //implement searching
  useEffect(() => {
    fetchUsers();
  }, [debouncedSearch]);


  return (
    <div className="flex flex-col gap-2">
      <div className="navbar bg-secondary-content">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl font-bold">Yap.</a>
        </div>
        <div className="flex-none gap-2" ref={searchRef}>
          <div className="relative" ref={friendRequstRef}>
            <button className="btn btn-ghost" onClick={openFriendRequestModal}>Friend Requests  <div className="badge badge-secondary">{pendingFriendRequests.length}</div></button>
            {friendRequestModal && <FriendRequestModal requests = {pendingRequests} setPendingRequests={setPendingRequests} loading={loading}  />}
          </div>
          <div className="form-control hidden md:block relative">
            <input
              type="text"
              placeholder="Add friends!"
              className="input input-bordered w-24 md:w-auto"
              onChange={handleSearch}
              value={input}
              onClick={handleModal}
            />
            {modalOpen && <SearchCard searchResults={searchResults} setPendingRequests = {setPendingRequests} searchLoading ={searchLoading} />}
          </div>
          <div className="dropdown dropdown-end">
           <button className="p-4"><FaCog /></button>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content rounded-box w-52 bg-secondary-content"
            >
              <li className="p-2 self-center bg-base-300 w-full rounded-md mb-1">Hey! {user?.userName}</li>
              <li>
                <a className="justify-between">Profile</a>
              </li>
              <li onClick={handleLogout}>
                <a>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="p-2 self-center w-[70%] "></div>
    </div>
  );
};

export default Header;
