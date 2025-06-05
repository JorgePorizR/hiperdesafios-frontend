import { useState, useEffect } from 'react';
import axios from 'axios';

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [usuario, setUsuario] = useState({
    id: '',
    nombre: '',
    apellido: '',
    email: '',
    esAdmin: false
  });

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = sessionStorage.getItem('token');

      if (token) {
        const { data } = await axios.get('http://localhost:3000/api/me', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (data.message === "User not authenticated") {
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('usuario_id');
          sessionStorage.removeItem('usuario_nombre');
          sessionStorage.removeItem('usuario_apellido');
          sessionStorage.removeItem('usuario_email');
          sessionStorage.removeItem('usuario_esAdmin');
          setIsLoggedIn(false);
          window.location.href = '/login';
          return;
        }
        setUsuario({
          id: data.id,
          nombre: data.nombre,
          apellido: data.apellido,
          email: data.email,
          esAdmin: data.esAdmin
        });
      }
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus);
    return () => window.removeEventListener('storage', checkLoginStatus);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario_id');
    sessionStorage.removeItem('usuario_nombre');
    sessionStorage.removeItem('usuario_apellido');
    sessionStorage.removeItem('usuario_email');
    sessionStorage.removeItem('usuario_esAdmin');
    setIsLoggedIn(false);
    window.location.href = '/login';
  };

  return (
    <div className="relative">
      <button 
        onClick={toggleMenu}
        className="flex items-center p-2 rounded-full hover:bg-gray-100 focus:outline-none transition-colors duration-200"
      >
        <svg 
          className="h-6 w-6 text-gray-600 hover:text-gray-800" 
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
        <span className="ml-2">{usuario.nombre}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-10 border border-gray-100">
          {isLoggedIn ? (
            <>
              <a 
                href="/profile" 
                className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                <svg className="h-5 w-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Perfil
              </a>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
              >
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Cerrar Sesión
              </button>
            </>
          ) : (
            <a 
              href="/login" 
              className="flex items-center px-4 py-3 text-sm text-blue-600 hover:bg-blue-50 transition-colors duration-200"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Iniciar Sesión
            </a>
          )}
        </div>
      )}
    </div>
  );
}