import { useState } from 'react';

interface UserMenuProps {
  isLoggedIn: boolean;
}

export default function UserMenu({ isLoggedIn }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      {/* Icono de usuario */}
      <button 
        onClick={toggleMenu}
        className="flex items-center p-2 rounded-full hover:bg-gray-100 focus:outline-none"
      >
        <svg 
          className="h-6 w-6 text-gray-600" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
          />
        </svg>
      </button>

      {/* Menú desplegable */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          {isLoggedIn ? (
            <>
              <a 
                href="/profile" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Profile
              </a>
              <a 
                href="/logout" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Log Out
              </a>
            </>
          ) : (
            <a 
              href="/login" 
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Log In
            </a>
          )}
        </div>
      )}
    </div>
  );
}