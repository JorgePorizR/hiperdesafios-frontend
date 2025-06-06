import { useEffect, useState } from 'react';
import axios from 'axios';

interface Temporada {
  id: number;
  nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: string;
}

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
}

interface RankingData {
  id: number;
  temporada_id: number;
  usuario_id: number;
  posicion: number;
  puntos_totales: number;
  usuario: Usuario;
  temporada: Temporada;
}

export default function RankingComponent() {
  const [temporadas, setTemporadas] = useState<Temporada[]>([]);
  const [selectedTemporada, setSelectedTemporada] = useState<number | null>(null);
  const [rankingData, setRankingData] = useState<RankingData[]>([]);

  // Cargar temporadas al montar el componente
  useEffect(() => {
    const fetchTemporadas = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/temporadas');
        setTemporadas(response.data);
        // Establecer la temporada activa como seleccionada por defecto
        const temporadaActiva = response.data.find((t: Temporada) => t.estado === "ACTIVA");
        if (temporadaActiva) {
          setSelectedTemporada(temporadaActiva.id);
        } else if (response.data.length > 0) {
          setSelectedTemporada(response.data[0].id);
        }
      } catch (error) {
        console.error('Error al cargar temporadas:', error);
      }
    };

    fetchTemporadas();
  }, []);

  // Cargar ranking cuando cambie la temporada seleccionada
  useEffect(() => {
    const fetchRanking = async () => {
      if (selectedTemporada) {
        try {
          const response = await axios.get(`http://localhost:3000/api/rankings/temporada/${selectedTemporada}`);
          setRankingData(response.data);
        } catch (error) {
          console.error('Error al cargar ranking:', error);
        }
      }
    };

    fetchRanking();
  }, [selectedTemporada]);

  const renderPodio = () => {
    if (rankingData.length === 0) {
      return (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-4xl mb-4">🏆</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">¡El podio está en construcción!</h3>
          <p className="text-gray-500">Aún no hay participantes en esta temporada.</p>
        </div>
      );
    }

    return (
      <div className="flex justify-center items-end gap-4 h-64">
        {/* Segundo Lugar */}
        <div className="flex flex-col items-center w-1/3 group">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl mb-2 
                    transition-all duration-300 group-hover:scale-110 group-hover:bg-gray-300 
                    group-hover:shadow-lg group-hover:shadow-gray-400/50 group-hover:rotate-3">
            {rankingData[1] ? "🥈" : "?"}
          </div>
          <div className="bg-gray-100 rounded-t-lg p-4 w-full text-center transition-all duration-300
                    group-hover:bg-gray-200 group-hover:shadow-lg group-hover:-translate-y-1
                    group-hover:border-2 group-hover:border-gray-300">
            <div className="text-2xl font-bold text-gray-400 mb-1 group-hover:text-gray-600">2</div>
            {rankingData[1] ? (
              <>
                <div className="font-semibold text-gray-700 group-hover:text-gray-900">
                  {rankingData[1].usuario.nombre} {rankingData[1].usuario.apellido}
                </div>
                <div className="text-[#ED6A0F] font-bold group-hover:text-[#d45a00]">{rankingData[1].puntos_totales} pts</div>
              </>
            ) : (
              <div className="text-gray-500 italic">Puesto disponible</div>
            )}
          </div>
        </div>
        
        {/* Primer Lugar */}
        <div className="flex flex-col items-center w-1/3 group">
          <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center text-3xl mb-2
                    transition-all duration-300 group-hover:scale-125 group-hover:bg-yellow-200
                    group-hover:shadow-lg group-hover:shadow-yellow-400/50 group-hover:rotate-6
                    group-hover:animate-pulse">
            {rankingData[0] ? "👑" : "?"}
          </div>
          <div className="bg-[#ED6A0F] rounded-t-lg p-4 w-full text-center transition-all duration-300
                    group-hover:bg-[#d45a00] group-hover:shadow-xl group-hover:-translate-y-3
                    group-hover:border-2 group-hover:border-yellow-300">
            <div className="text-2xl font-bold text-white mb-1 group-hover:text-yellow-100">1</div>
            {rankingData[0] ? (
              <>
                <div className="font-semibold text-white group-hover:text-yellow-100">
                  {rankingData[0].usuario.nombre} {rankingData[0].usuario.apellido}
                </div>
                <div className="text-white font-bold group-hover:text-yellow-100">{rankingData[0].puntos_totales} pts</div>
              </>
            ) : (
              <div className="text-yellow-100 italic">Puesto disponible</div>
            )}
          </div>
        </div>
        
        {/* Tercer Lugar */}
        <div className="flex flex-col items-center w-1/3 group">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-2xl mb-2
                    transition-all duration-300 group-hover:scale-105 group-hover:bg-amber-200
                    group-hover:shadow-lg group-hover:shadow-amber-400/50 group-hover:-rotate-3">
            {rankingData[2] ? "🥉" : "?"}
          </div>
          <div className="bg-amber-600 rounded-t-lg p-4 w-full text-center transition-all duration-300
                    group-hover:bg-amber-700 group-hover:shadow-lg group-hover:-translate-y-1
                    group-hover:border-2 group-hover:border-amber-400">
            <div className="text-2xl font-bold text-white mb-1 group-hover:text-amber-100">3</div>
            {rankingData[2] ? (
              <>
                <div className="font-semibold text-white group-hover:text-amber-100">
                  {rankingData[2].usuario.nombre} {rankingData[2].usuario.apellido}
                </div>
                <div className="text-white font-bold group-hover:text-amber-100">{rankingData[2].puntos_totales} pts</div>
              </>
            ) : (
              <div className="text-amber-100 italic">Puesto disponible</div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Selector de Temporada */}
      <div className="mb-8">
        <select
          value={selectedTemporada || ''}
          onChange={(e) => setSelectedTemporada(Number(e.target.value))}
          className="w-full max-w-xs mx-auto block px-4 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#ED6A0F] focus:border-[#ED6A0F]"
        >
          {temporadas.map((temporada) => (
            <option key={temporada.id} value={temporada.id}>
              {temporada.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Podio Top 3 */}
      <div className="mb-12">
        {renderPodio()}
      </div>

      {/* Tabla del resto de posiciones */}
      {rankingData.length > 3 ? (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posición</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Puntos</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rankingData.slice(3).map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">#{user.posicion}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center text-lg">
                        🎮
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.usuario.nombre} {user.usuario.apellido}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold" style={{color: '#ED6A0F'}}>{user.puntos_totales} pts</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No hay más participantes en el ranking.</p>
        </div>
      )}
    </div>
  );
} 