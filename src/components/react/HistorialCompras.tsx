import { useEffect, useState } from 'react';
import axios from 'axios';

interface Producto {
  id: number;
  nombre: string;
  precio: string;
}

interface DetalleCompra {
  producto_id: number;
  cantidad: number;
  precio_unitario: string;
  subtotal: string;
  producto: Producto | null;
}

interface Compra {
  id: number;
  fecha_compra: string;
  monto_total: string;
  puntos_ganados: number;
  sucursal: string;
  detalles: DetalleCompra[];
}

export default function HistorialCompras() {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompras = async () => {
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
        const response = await axios.get(`http://localhost:3000/api/compras/usuario/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setCompras(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };
    fetchCompras();
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
        Historial de Compras
        <div className="w-24 h-1 bg-[#ED6A0F] mx-auto mt-2"></div>
      </h2>
      {compras.length === 0 ? (
        <div className="text-center p-8 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500 text-lg">Aún no has realizado compras</p>
          <p className="text-gray-400 mt-2">¡Aprovecha las ofertas y compra ahora!</p>
        </div>
      ) : (
        <div className="space-y-8">
          {compras.map((compra) => (
            <div key={compra.id} className="bg-white rounded-xl shadow-lg p-6 border-l-8 border-[#ED6A0F]">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                <div>
                  <span className="text-lg font-semibold text-gray-800">Compra #{compra.id}</span>
                  <span className="ml-4 text-sm text-gray-500">{new Date(compra.fecha_compra).toLocaleString()}</span>
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-2 mt-2 md:mt-0">
                  <span className="bg-[#ED6A0F] text-white px-3 py-1 rounded-full text-sm font-semibold">{compra.sucursal}</span>
                  <span className="text-green-600 font-bold ml-2">+{compra.puntos_ganados} pts</span>
                  <span className="text-gray-700 font-bold ml-2">${parseFloat(compra.monto_total).toFixed(2)}</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio Unitario</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {compra.detalles.map((detalle, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-2 whitespace-nowrap text-gray-800">
                          {detalle.producto ? detalle.producto.nombre : 'Producto eliminado'}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">{detalle.cantidad}</td>
                        <td className="px-4 py-2 whitespace-nowrap">${parseFloat(detalle.precio_unitario).toFixed(2)}</td>
                        <td className="px-4 py-2 whitespace-nowrap font-semibold">${parseFloat(detalle.subtotal).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 