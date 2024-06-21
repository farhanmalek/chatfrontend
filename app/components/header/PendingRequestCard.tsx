import { UserProfile } from '@/app/models/UserModel'
import { handleFriendRequest } from '@/app/services/FriendService';
import React, { useEffect, useState } from 'react'

interface PendingRequestCardProps {
    user: UserProfile
    request: UserProfile
    index: number
    setPendingRequests: React.Dispatch<React.SetStateAction<UserProfile[]>>;
  
}

const PendingRequestCard = ({user,request,index,setPendingRequests}: PendingRequestCardProps) => {
  const [decision, setDecision] = useState<'accept'| 'decline' | null>(null);

  const handleDecision = async (action: 'accept' | 'decline') => {
    setDecision(action);
    setTimeout(() => {
      
      setPendingRequests((prev) => prev.filter((_, i) => i !== index)); //Remove the request from the list
    },1000)
  }
  
  useEffect(() => {
    const makeDecisionCall = async () => {
      if(decision){
          await handleFriendRequest(user, decision);
      }
    
    }
    makeDecisionCall();
  },[decision])

  return (
    <div className='bg-base-300 p-3 flex justify-between w-full'>
        <p className='text-sm self-center'>{user.userName} wants to be friends.</p>
        <div className='flex gap-2'>
            {
                decision === 'accept' ? 
                <p className='text-sm text-green-500'>Request Accepted</p> 
                : decision === 'decline' ? <p className='text-sm text-red-500'>Request Declined</p> 
                :
                <div className='flex gap-2'>
                <button onClick={() => handleDecision('accept')} className='rounded-md bg-success-content hover:bg-green-900 p-2'>Accept</button>
                <button onClick={() => handleDecision('decline')} className='rounded-md bg-warning-content hover:bg-red-900 p-2'>Decline</button>
                </div>
            }
            
        </div>
        </div>
  )
}

export default PendingRequestCard