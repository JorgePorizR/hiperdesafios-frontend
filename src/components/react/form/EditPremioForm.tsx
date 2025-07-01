import React, { useState } from 'react';
import axios from 'axios';

interface Premio {
  id: number;
  nombre: string;
  descripcion: string;
  estado: boolean;
}

interface Props {
  premio: Premio;
  onUpdated: (premio: Premio) => void;
  onCancel: () => void;
}

const EditPremioForm: React.FC<Props> = ({ premio, onUpdated, onCancel }) => {
  const [nombre, setNombre] = useState(premio.nombre);
  const [descripcion, setDescripcion] = useState(premio.descripcion);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !descripcion) {
      setError('Todos los campos son obligatorios');
      return;
    }
    setLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const res = await axios.put(`http://localhost:3000/api/premios/${premio.id}`, { nombre, descripcion }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      onUpdated(res.data.premio);
    } catch {
      setError('Error al actualizar premio');
    }
    setLoading(false);
  };

  return (
    <form className="bg-white p-4 rounded shadow mb-4" onSubmit={handleSubmit}>
      <h3 className="text-lg font-bold mb-2">Editar Premio</h3>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="mb-2">
        <label className="block mb-1">Nombre</label>
        <input
          className="w-full border px-2 py-1 rounded"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
        />
      </div>
      <div className="mb-2">
        <label className="block mb-1">Descripción</label>
        <textarea
          className="w-full border px-2 py-1 rounded"
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
        />
      </div>
      <div className="flex space-x-2 mt-2">
        <button
          type="submit"
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          disabled={loading}
        >
          {loading ? 'Actualizando...' : 'Actualizar'}
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          onClick={onCancel}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default EditPremioForm; 