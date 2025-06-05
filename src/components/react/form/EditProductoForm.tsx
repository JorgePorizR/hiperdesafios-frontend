import { useState, useEffect } from 'react';
import axios from 'axios';
import { categories } from '../../../models/categories';

interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  es_destacado: boolean;
  stock: number;
  punto_extra: number;
}

interface EditProductoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  productoId: number;
}

export default function EditProductoForm({ isOpen, onClose, onSuccess, productoId }: EditProductoFormProps) {
  const [formData, setFormData] = useState<Producto>({
    id: 0,
    nombre: '',
    categoria: '',
    precio: 0,
    es_destacado: false,
    stock: 0,
    punto_extra: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchProducto();
    }
  }, [isOpen, productoId]);

  const fetchProducto = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/productos/${productoId}`, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      });
      setFormData(response.data);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cargar el producto');
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.patch(`http://localhost:3000/api/productos/${productoId}`, formData, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar el producto');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Editar Producto</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Categoría</label>
            <select
              value={formData.categoria}
              onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Seleccione una categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Precio</label>
            <input
              type="number"
              value={formData.precio}
              onChange={(e) => setFormData({ ...formData, precio: parseFloat(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Stock</label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Puntos Extra</label>
            <input
              type="number"
              value={formData.punto_extra}
              onChange={(e) => setFormData({ ...formData, punto_extra: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
              min="0"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="es_destacado"
              checked={formData.es_destacado}
              onChange={(e) => setFormData({ ...formData, es_destacado: e.target.checked })}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="es_destacado" className="ml-2 block text-sm text-gray-700">
              Producto Destacado
            </label>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {isLoading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}