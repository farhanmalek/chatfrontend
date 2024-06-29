interface ChatDropDownProps {
    editChatName?: boolean;
    setEditChatName: (arg0: boolean) => void;
}

const ChatDropDown = ({setEditChatName}: ChatDropDownProps) => {

  return (
    <div className="w-[300px] absolute right-0 bottom-0">
    <ul
      tabIndex={0}
      className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content rounded-box w-52 bg-secondary-content"
    >
      <li>
        <a onClick={() => setEditChatName(true)}>Edit Chat Name</a>
      </li>
    </ul>
  </div>
  )
}

export default ChatDropDown