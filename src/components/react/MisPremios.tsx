import { useEffect, useState } from 'react';
import axios from 'axios';

interface Premio {
  id: number;
  nombre: string;
  descripcion: string;
  estado: boolean;
  fecha_expiracion: string;
  fecha_obtencion: string;
  usado: boolean;
  premio_usuario_id: number;
  expirado?: boolean;
}

export default function MisPremios() {
  const [premios, setPremios] = useState<Premio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPremios = async () => {
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

        const response = await axios.get(`http://localhost:3000/api/premios/usuario/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setPremios(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchPremios();
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

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Mis Premios
        <div className="w-24 h-1 bg-[#ED6A0F] mx-auto mt-2"></div>
      </h2>
      
      {premios.length === 0 ? (
        <div className="text-center p-8 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500 text-lg">Aún no has obtenido ningún premio</p>
          <p className="text-gray-400 mt-2">¡Sigue participando para ganar premios!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {premios.map((premio) => (
            <div 
              key={premio.premio_usuario_id} 
              className={`bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl ${premio.expirado ? 'opacity-60' : ''}`}
            >
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-800">{premio.nombre}</h3>
                <p className="text-gray-600 mb-4">{premio.descripcion}</p>
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-gray-500">
                    Obtenido: {new Date(premio.fecha_obtencion).toLocaleDateString()}
                  </span>
                  <span className="text-sm text-gray-500">
                    Expira: {new Date(premio.fecha_expiracion).toLocaleDateString()}
                  </span>
                  <span className={`text-sm font-semibold ${premio.usado ? 'text-red-500' : 'text-green-600'}`}>
                    {premio.usado ? 'Usado' : (premio.expirado ? 'Expirado' : 'Disponible')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 