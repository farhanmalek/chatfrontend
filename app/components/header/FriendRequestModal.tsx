import { UserProfile } from '@/app/models/UserModel';
import React from 'react';
import PendingRequestCard from './PendingRequestCard';
import Spinner from '@/app/loading/Spinner';

interface FriendRequestModalProps {
  requests: UserProfile[];
  setPendingRequests: React.Dispatch<React.SetStateAction<UserProfile[]>>;
  loading: boolean;
}

const FriendRequestModal = ({ requests,setPendingRequests, loading}: FriendRequestModalProps) => {


  return (
    <div className="bg-base-200 w-[320px] rounded-md absolute right-[-65px] md:right-0 mt-2 z-50">
      {
        loading ? <div className='flex justify-center p-5'><Spinner /></div> : (
          <>
          {requests.length >= 1 ? (
        requests.map((user, index) => (
          <PendingRequestCard key={user!.userId} user={user!} request={user} index = {index} setPendingRequests={setPendingRequests}/>
        ))
      ) : (
        <p className="p-3">No new friends.</p>
      )}
          </>
        )
      }

      
    </div>
  );
};

export default FriendRequestModal;
