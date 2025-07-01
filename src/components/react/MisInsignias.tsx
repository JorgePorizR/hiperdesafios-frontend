import { useEffect, useState } from 'react';
import axios from 'axios';

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  insignia_usuario: {
    fecha_obtencion: string;
    usuario_id: number;
    insignia_id: number;
    temporada_id: number;
    createdAt: string;
    updatedAt: string;
  };
}

interface Insignia {
  imagenUrl: string;
  id: number;
  nombre: string;
  descripcion: string;
  estado: boolean;
  requirimiento: string;
  cantidad: number;
  usuarios: Usuario[];
}

export default function MisInsignias() {
  const [insignias, setInsignias] = useState<Insignia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsignias = async () => {
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

        const response = await axios.get(`http://localhost:3000/api/insignias/usuario/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log(response);
        setInsignias(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchInsignias();
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
        Mis Logros del Supermercado
        <div className="w-24 h-1 bg-[#ED6A0F] mx-auto mt-2"></div>
      </h2>
      
      {insignias.length === 0 ? (
        <div className="text-center p-8 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500 text-lg">Aún no has obtenido ninguna insignia</p>
          <p className="text-gray-400 mt-2">¡Sigue comprando para desbloquear logros!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {insignias.map((insignia) => (
            <div 
              key={insignia.id} 
              className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="relative">
                <div className="absolute top-0 right-0 bg-[#ED6A0F] text-white px-3 py-1 rounded-bl-lg font-semibold">
                  {insignia.requirimiento}
                </div>
                <img 
                  src={insignia.imagenUrl} 
                  alt={insignia.nombre}
                  className="w-full h-48 object-contain"
                />
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-800">{insignia.nombre}</h3>
                <p className="text-gray-600 mb-4">{insignia.descripcion}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      Obtenida: {new Date(insignia.usuarios[0]?.insignia_usuario.fecha_obtencion).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 