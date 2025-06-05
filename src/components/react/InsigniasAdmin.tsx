import { useState, useRef } from 'react';
import CreateInsigniaForm from './form/CreateInsigniaForm';
import EditInsigniaForm from './form/EditInsigniaForm';

interface Insignia {
  id: number;
  nombre: string;
  descripcion: string;
  imagenUrl: string;
  requirimiento: string;
  cantidad: number;
}

export default function InsigniasAdmin() {
  const [insignias, setInsignias] = useState<Insignia[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedInsignia, setSelectedInsignia] = useState<Insignia | null>(null);
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

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

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta insignia?')) return;
    try {
      await fetch(`http://localhost:3000/api/insignias/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      });
      fetchInsignias();
    } catch (error) {
      alert('Error al eliminar insignia');
    }
  };

  const handleUploadClick = (id: number) => {
    if (fileInputRefs.current[id]) {
      fileInputRefs.current[id]!.click();
    }
  };

  const handleFileChange = async (id: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('imagen', file);
    try {
      await fetch(`http://localhost:3000/api/insignias/${id}/imagen`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: formData as any
      });
      alert('Imagen subida correctamente');
      fetchInsignias();
    } catch (error) {
      alert('Error al subir imagen');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Lista de Insignias</h2>
        <div className="space-x-3">
          <button
            onClick={() => setShowCreate(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Crear Insignia
          </button>
          <button
            onClick={fetchInsignias}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Actualizar Lista
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imagen</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requerimiento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {insignias.map((insignia) => (
                <tr key={insignia.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img src={insignia.imagenUrl} alt={insignia.nombre} className="w-16 h-16 object-contain" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{insignia.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{insignia.descripcion}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{insignia.requirimiento}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{insignia.cantidad}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => {
                        setSelectedInsignia(insignia);
                        setShowEdit(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(insignia.id)}
                      className="text-red-600 hover:text-red-900 mr-3"
                    >
                      Eliminar
                    </button>
                    <button
                      onClick={() => handleUploadClick(insignia.id)}
                      className="text-green-600 hover:text-green-900"
                    >
                      Subir Imagen
                    </button>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      ref={el => { if (el) fileInputRefs.current[insignia.id] = el; }}
                      onChange={e => handleFileChange(insignia.id, e)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <CreateInsigniaForm
              onClose={() => setShowCreate(false)}
              onCreated={() => {
                setShowCreate(false);
                fetchInsignias();
              }}
            />
          </div>
        </div>
      )}

      {showEdit && selectedInsignia && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <EditInsigniaForm
              insignia={selectedInsignia}
              onClose={() => {
                setShowEdit(false);
                setSelectedInsignia(null);
              }}
              onUpdated={() => {
                setShowEdit(false);
                setSelectedInsignia(null);
                fetchInsignias();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
} 