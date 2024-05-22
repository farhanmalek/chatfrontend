import { UserProfile } from "@/app/models/UserModel"

interface FriendCardProps {
user: UserProfile
action: 'Add' | 'Accept' | 'Reject' | 'Message'
}

const FriendCard = ({user, action}:FriendCardProps) => {

  return (
    <div className='bg-base-300 rounded-lg p-3 flex justify-between w-full'>
        <p className='font-bold'>{user.userName}</p>
        <p>{action}</p>
    </div>
  )
}

export default FriendCard