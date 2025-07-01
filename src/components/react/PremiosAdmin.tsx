import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CreatePremioForm from './form/CreatePremioForm';
import EditPremioForm from './form/EditPremioForm';

interface Premio {
  id: number;
  nombre: string;
  descripcion: string;
  estado: boolean;
}

const PremiosAdmin: React.FC = () => {
  const [premios, setPremios] = useState<Premio[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editPremio, setEditPremio] = useState<Premio | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchPremios = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const res = await axios.get('http://localhost:3000/api/premios', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setPremios(res.data);
    } catch (err) {
      setError('Error al cargar premios');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPremios();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('¿Seguro que deseas eliminar este premio?')) return;
    try {
      const token = sessionStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/premios/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setPremios(premios.filter(p => p.id !== id));
    } catch {
      setError('Error al eliminar premio');
    }
  };

  const handleCreate = async () => {
    setShowCreate(true);
  };

  const handleEdit = (premio: Premio) => {
    setEditPremio(premio);
  };

  const handleCreated = (nuevo: Premio) => {
    setPremios([...premios, nuevo]);
    setShowCreate(false);
  };

  const handleUpdated = (actualizado: Premio) => {
    setPremios(premios.map(p => (p.id === actualizado.id ? actualizado : p)));
    setEditPremio(null);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Gestión de Premios</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <button
        className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        onClick={handleCreate}
      >
        Crear Premio
      </button>
      {showCreate && (
        <CreatePremioForm
          onCreated={handleCreated}
          onCancel={() => setShowCreate(false)}
        />
      )}
      {editPremio && (
        <EditPremioForm
          premio={editPremio}
          onUpdated={handleUpdated}
          onCancel={() => setEditPremio(null)}
        />
      )}
      {loading ? (
        <div>Cargando premios...</div>
      ) : (
        <table className="min-w-full bg-white border mt-4">
          <thead>
            <tr>
              <th className="py-2 px-4 border">ID</th>
              <th className="py-2 px-4 border">Nombre</th>
              <th className="py-2 px-4 border">Descripción</th>
              <th className="py-2 px-4 border">Estado</th>
              <th className="py-2 px-4 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {premios.map((premio) => (
              <tr key={premio.id}>
                <td className="py-2 px-4 border">{premio.id}</td>
                <td className="py-2 px-4 border">{premio.nombre}</td>
                <td className="py-2 px-4 border">{premio.descripcion}</td>
                <td className="py-2 px-4 border">{premio.estado ? 'Activo' : 'Inactivo'}</td>
                <td className="py-2 px-4 border space-x-2">
                  <button
                    className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                    onClick={() => handleEdit(premio)}
                  >
                    Editar
                  </button>
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => handleDelete(premio.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PremiosAdmin; 