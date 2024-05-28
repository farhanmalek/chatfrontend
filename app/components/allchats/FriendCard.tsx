import { useChat } from "@/app/context/chatContext"
import { UserProfile } from "@/app/models/UserModel"
import { checkStatus, sendFriendRequest } from "@/app/services/FriendService"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

interface FriendCardProps {
user: UserProfile
action?: 'Add' | 'Message'
chatParticipantList?: UserProfile[]
setChatParticipantList?: (arg0: any) => void
}

const FriendCard = ({user, action, chatParticipantList, setChatParticipantList}:FriendCardProps) => {

    const [status, setStatus] = useState<string>('')

    const findStatus = async () => {
      const response = await checkStatus(user)
  
      if (response?.data === "Friendship doesnt exist") {
        setStatus("Add")
      } else if (response?.data === "Pending") {
        setStatus("Pending")
      } else if (response?.data === "Accepted") {
        setStatus("Message")
      }
    }

  useEffect(() => {
    findStatus()
  }, [])


  const handleFriendAdd = async () => {
    const response = await sendFriendRequest(user)
    if (response?.status === 200) {
      toast.success(`Friend Request Sent to ${user.userName}`)
    } else {
      toast.error("Error sending friend request")
    }
  }

  const addToParticipantList = () => {
    //add user to the list of participants
    if (chatParticipantList && setChatParticipantList) {
      setChatParticipantList((prev: any) => [...prev, user]);
    }

  }

  const removeFromParticipantList = () => {
    //remove user from the list of participants
    if (chatParticipantList && setChatParticipantList) {
      setChatParticipantList((prev: any[]) => prev.filter((participant) => participant.userId !== user.userId));
    }
  }

 

  return (
    <div className='bg-base-300 rounded-lg p-3 flex justify-between w-full'>
        <p className='font-bold'>{user.userName}</p>
        {
          status === 'Pending' ? <p className='text-yellow-500'>Pending</p> : null
        }
        {
          status === 'Message' ? chatParticipantList?.includes(user) ? <button className="text-green italic" onClick={removeFromParticipantList}>Remove</button> : <button className='text-white italic' onClick={addToParticipantList}>Message</button> : null
        }
        {
          status === 'Add' ? <button className="px-2 py-1 bg-slate-500 rounded-md font-semibold text-black hover:bg-slate-800 hover:text-white" onClick={handleFriendAdd}>{action}</button> : null
        }

    </div>
  )
}

export default FriendCard