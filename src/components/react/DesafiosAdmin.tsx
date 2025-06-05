import { useState, useEffect } from 'react';
import axios from 'axios';
import CreateDesafioForm from './form/CreateDesafioForm';

interface Desafio {
  id: number;
  nombre: string;
  descripcion: string;
  puntos_recompensa: number;
  fecha_inicio: number;
  fecha_fin: number;
  estado: boolean;
}

export default function DesafiosAdmin() {
  const [desafios, setDesafios] = useState<Desafio[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const fetchDesafios = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/desafios', {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      });
      setDesafios(response.data);
    } catch (error) {
      console.error('Error fetching desafios:', error);
    }
  };

  useEffect(() => {
    fetchDesafios();
  }, []);

  const handleDesactivar = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres desactivar este desafío?')) {
      try {
        await axios.post(`http://localhost:3000/api/desafios/${id}/desactivar`, {}, {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
          }
        });
        await fetchDesafios();
      } catch (error) {
        console.error('Error desactivando desafío:', error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
        Crear Desafío
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descripción
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Puntos de recompensa
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha de inicio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha de fin
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {desafios.map((desafio) => (
              <tr key={desafio.id}>
                <td className="px-6 py-4 whitespace-nowrap">{desafio.nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap">{desafio.descripcion}</td>
                <td className="px-6 py-4 whitespace-nowrap">{desafio.puntos_recompensa}</td>
                <td className="px-6 py-4 whitespace-nowrap">{desafio.fecha_inicio}</td>
                <td className="px-6 py-4 whitespace-nowrap">{desafio.fecha_fin}</td>
                <td className="px-6 py-4 whitespace-nowrap">{desafio.estado ? 'Activo' : 'Inactivo'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleDesactivar(desafio.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Desactivar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <CreateDesafioForm
              onClose={() => setShowCreateForm(false)}
              onDesafioCreated={() => { 
                fetchDesafios();
                setShowCreateForm(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
