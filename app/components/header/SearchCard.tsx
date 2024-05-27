import { UserProfile } from "@/app/models/UserModel"
import FriendCard from "../allchats/FriendCard"

interface searchProps {
  searchResults: UserProfile[]
}

const SearchCard = ({searchResults}: searchProps) => {

  console.log(searchResults)

  return (
    <div className="bg-base-200 w-[300px] rounded-md absolute right-0 mt-2 z-50">
        {
          searchResults.length >= 1 ?
          searchResults.map((user: UserProfile) => {
            return (
              <FriendCard key={user.userId} user={user} action="Add"/>
            )
          }) : <p className="text-white p-3 italic">No Results Found</p>
        }
        
    </div>
  )
}

export default SearchCard