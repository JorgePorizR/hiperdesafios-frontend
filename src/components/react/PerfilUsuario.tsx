import { useEffect, useState } from 'react';
import axios from 'axios';

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
}

export default function PerfilUsuario() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const userId = sessionStorage.getItem('usuario_id');
        const token = sessionStorage.getItem('token');
        if (!userId) {
          setError('No se encontró el ID del usuario');
          setLoading(false);
          return;
        }
        if (!token) {
          setError('No se encontró el token de autenticación');
          setLoading(false);
          return;
        }
        const response = await axios.get(`http://localhost:3000/api/usuarios/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setUsuario(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };
    fetchUsuario();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#ED6A0F]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-50 rounded-lg border border-red-200">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow-sm">
        <p className="text-gray-500 text-lg">No se encontraron datos del usuario</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 mt-8 border-l-8 border-[#ED6A0F]">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Mi Perfil</h2>
      <div className="space-y-4 mb-8">
        <div>
          <span className="block text-gray-500 font-semibold">Nombre</span>
          <span className="block text-gray-800 text-lg">{usuario.nombre}</span>
        </div>
        <div>
          <span className="block text-gray-500 font-semibold">Apellido</span>
          <span className="block text-gray-800 text-lg">{usuario.apellido}</span>
        </div>
        <div>
          <span className="block text-gray-500 font-semibold">Correo electrónico</span>
          <span className="block text-gray-800 text-lg">{usuario.email}</span>
        </div>
      </div>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Mi historial de compras</h3>
          <a href="/history" className="text-[#ED6A0F] font-semibold hover:underline">Ver historial de compras</a>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Mis insignias ganadas</h3>
          <a href="/insignias/me" className="text-[#ED6A0F] font-semibold hover:underline">Ver mis insignias</a>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Mis premios ganados</h3>
          <a href="/premios/me" className="text-[#ED6A0F] font-semibold hover:underline">Ver mis premios</a>
        </div>
      </div>
    </div>
  );
} 