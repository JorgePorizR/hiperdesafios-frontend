import { useState } from 'react';

interface Insignia {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string;
  puntos_requeridos: number;
}

export default function InsigniasAdmin() {
  const [insignias, setInsignias] = useState<Insignia[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchInsignias = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/insignias', {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Error al cargar insignias');
      const data = await response.json();
      setInsignias(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Lista de Insignias</h2>
        <button
          onClick={fetchInsignias}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Actualizar Lista
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {insignias.map((insignia) => (
            <div key={insignia.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4">
                <div className="flex items-center justify-center mb-4">
                  <img
                    src={insignia.imagen}
                    alt={insignia.nombre}
                    className="w-24 h-24 object-contain"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {insignia.nombre}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {insignia.descripcion}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Puntos requeridos: {insignia.puntos_requeridos}
                  </span>
                  <div className="space-x-2">
                    <button className="text-indigo-600 hover:text-indigo-900 text-sm">
                      Editar
                    </button>
                    <button className="text-red-600 hover:text-red-900 text-sm">
                      Eliminar
                    </button>
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