import FriendCard from "../allchats/FriendCard"


const SearchCard = () => {
  return (
    <div className="bg-base-200 w-[300px] rounded-md absolute right-0 mt-2 z-50">
        <FriendCard/>
        <FriendCard/>
        <FriendCard/>
        <FriendCard/>
        <FriendCard/>
    </div>
  )
}

export default SearchCard