import { UserProfile } from '@/app/models/UserModel'
import React from 'react'
import PendingRequestCard from './PendingRequestCard'
interface FriendRequestModalProps {
    requests: UserProfile[]
    getPendingRequests: () => void
    }

const FriendRequestModal = ({requests, getPendingRequests}:FriendRequestModalProps) => {

  return (
    <div className="bg-base-200 w-[375px] rounded-md absolute right-[-65px] md:right-0 mt-2 z-50">
        {
          requests.length >= 1 ?
          requests.map((user: UserProfile) => {
            return (
              <PendingRequestCard key={user.userId} user={user} getPendingRequests={getPendingRequests}/>
            )
          }) : <p className="text-white p-3 italic">No new friends.</p>
        }
        
    </div>
  )
}

export default FriendRequestModal