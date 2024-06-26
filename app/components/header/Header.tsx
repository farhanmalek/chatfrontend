import React, { useState, useEffect, useRef } from 'react';
import SearchCard from './SearchCard';

const Header = () => {
  const [input, setInput] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setModalOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
  }

  function handleModal() {
    setModalOpen(!modalOpen);
  }

  return (
    <div className='flex flex-col gap-2'>
      <div className="navbar bg-secondary-content">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">WilliamsBook</a>
        </div>
        <div className="flex-none gap-2" ref={searchRef}>
          <div className="form-control hidden md:block relative">
            <input
              type="text"
              placeholder="Add friends!"
              className="input input-bordered w-24 md:w-auto"
              onChange={handleSearch}
              value={input}
              onClick={handleModal}
            />
            {modalOpen && <SearchCard />}
          </div>
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img alt="Tailwind CSS Navbar component" src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
              </div>
            </div>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content rounded-box w-52 bg-secondary-content">
              <li>
                <a className="justify-between">
                  Profile
                </a>
              </li>
              <li><a>Logout</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className='p-2 self-center w-[70%] '>

      </div>
    </div>
  );
};

export default Header;
