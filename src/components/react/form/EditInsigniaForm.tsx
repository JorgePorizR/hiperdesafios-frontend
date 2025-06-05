import { useState, useEffect } from 'react';
import axios from 'axios';

interface Insignia {
  id: number;
  nombre: string;
  descripcion: string;
  requirimiento: string;
  cantidad: number;
}

interface EditInsigniaFormProps {
  insignia: Insignia;
  onClose: () => void;
  onUpdated: () => void;
}

export default function EditInsigniaForm({ insignia, onClose, onUpdated }: EditInsigniaFormProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    requirimiento: '',
    cantidad: ''
  });

  useEffect(() => {
    setFormData({
      nombre: insignia.nombre,
      descripcion: insignia.descripcion,
      requirimiento: insignia.requirimiento,
      cantidad: insignia.cantidad.toString()
    });
  }, [insignia]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/api/insignias/${insignia.id}`, {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        requirimiento: formData.requirimiento,
        cantidad: formData.cantidad
      }, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      });
      onUpdated();
    } catch (error) {
      alert('Error al editar insignia');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Editar Insignia</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre</label>
          <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Requerimiento</label>
          <input type="text" name="requerimiento" value={formData.requirimiento} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Cantidad</label>
          <input type="number" name="cantidad" value={formData.cantidad} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
        </div>
        <div className="flex justify-end space-x-3">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md">Cancelar</button>
          <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md">Guardar</button>
        </div>
      </form>
    </div>
  );
} 