import { useState, useEffect } from 'react';
import axios from 'axios';
import CreateUsuarioForm from './form/CreateUsuarioForm';
import EditUsuarioForm from './form/EditUsuarioForm';

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  es_admin: boolean;
}

export default function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/usuarios', {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      });
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error fetching usuarios:', error);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        await axios.delete(`http://localhost:3000/api/usuarios/${id}`, {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
          }
        });
        await fetchUsuarios();
      } catch (error) {
        console.error('Error deleting usuario:', error);
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
          Crear Usuario
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
                Apellido
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td className="px-6 py-4 whitespace-nowrap">{usuario.nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap">{usuario.apellido}</td>
                <td className="px-6 py-4 whitespace-nowrap">{usuario.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{usuario.es_admin ? 'Administrador' : 'Usuario'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => {
                      setSelectedUsuario(usuario);
                      setShowEditForm(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(usuario.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Eliminar
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
            <CreateUsuarioForm
              onClose={() => setShowCreateForm(false)}
              onUsuarioCreated={() => {
                fetchUsuarios();
                setShowCreateForm(false);
              }}
            />
          </div>
        </div>
      )}

      {showEditForm && selectedUsuario && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <EditUsuarioForm
              usuario={selectedUsuario}
              onClose={() => {
                setShowEditForm(false);
                setSelectedUsuario(null);
              }}
              onUsuarioUpdated={() => {
                fetchUsuarios();
                setShowEditForm(false);
                setSelectedUsuario(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
