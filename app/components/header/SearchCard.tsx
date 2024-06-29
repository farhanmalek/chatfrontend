import { UserProfile } from "@/app/models/UserModel"
import FriendCard from "../allchats/FriendCard"
import Spinner from "@/app/loading/Spinner"

interface searchProps {
  searchResults: UserProfile[]
  setPendingRequests: any
  searchLoading: boolean
}

const SearchCard = ({searchResults, setPendingRequests,searchLoading}: searchProps) => {


  return (
    <div className="bg-base-200 w-[300px] rounded-md absolute right-0 mt-2 z-50">
        { searchLoading ? <div className="flex justify-center p-5"><Spinner/> </div>:
          searchResults.length >= 1 ?
          searchResults.map((user: UserProfile) => {
            return (
              <FriendCard key={user.userId} user={user} action="Add" setPendingRequests={setPendingRequests}/>
            )
          }) : <p className="text-white p-3 italic">No Results Found</p>
        }
        
    </div>
  )
}

export default SearchCard