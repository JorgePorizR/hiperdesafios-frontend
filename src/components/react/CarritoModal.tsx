import { useEffect, useState } from 'react';
import axios from 'axios';

interface Product {
  id: number;
  nombre: string;
  precio: number;
  imagenUrl: string;
  cantidad: number;
  stock_disponible: number;
}

export default function CarritoModal() {
  const [open, setOpen] = useState(false);
  const [carrito, setCarrito] = useState<Product[]>([]);
  const [stockError, setStockError] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      const carritoRaw = sessionStorage.getItem('carrito');
      setCarrito(carritoRaw ? JSON.parse(carritoRaw) : []);
    };
    update();
    window.addEventListener('storage', update);
    return () => window.removeEventListener('storage', update);
  }, []);

  const handleOpen = () => {
    const carritoRaw = sessionStorage.getItem('carrito');
    setCarrito(carritoRaw ? JSON.parse(carritoRaw) : []);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setStockError(null);
  };

  const updateCantidad = (id: number, cantidad: number) => {
    const producto = carrito.find(p => p.id === id);
    if (!producto) return;

    if (cantidad > producto.stock_disponible) {
      setStockError(`Solo hay ${producto.stock_disponible} unidades disponibles de ${producto.nombre}`);
      return;
    }

    setStockError(null);
    const nuevo = carrito.map(p => p.id === id ? { ...p, cantidad: Math.max(1, cantidad) } : p);
    setCarrito(nuevo);
    sessionStorage.setItem('carrito', JSON.stringify(nuevo));
  };

  const handleRemove = (id: number) => {
    const nuevo = carrito.filter(p => p.id !== id);
    setCarrito(nuevo);
    sessionStorage.setItem('carrito', JSON.stringify(nuevo));
    setStockError(null);
  };

  const subtotal = (p: Product) => p.precio * p.cantidad;
  const total = carrito.reduce((acc, p) => acc + subtotal(p), 0);

  const handleComprar = async () => {
    const usuario_id = sessionStorage.getItem('usuario_id');
    const token = sessionStorage.getItem('token');
    const productos = carrito.map(p => ({ producto_id: p.id, cantidad: p.cantidad, precio_unitario: Number(p.precio)}));
    const pedido = { usuario_id: Number(usuario_id), productos };
    
    try {
      const response = await axios.post('http://localhost:3000/api/compras', pedido, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200 || response.status === 201) {
        sessionStorage.removeItem('carrito');
        setCarrito([]);
        setOpen(false);
        alert('Pedido realizado con éxito. Gracias por tu compra.');
        window.location.reload();
      }
    } catch (error) {
      console.error('Error al realizar la compra:', error);
      alert('Hubo un error al procesar tu compra. Por favor, intenta nuevamente.');
    }
  };

  return (
    <>
      <button
        className="relative"
        onClick={handleOpen}
        aria-label="Ver carrito"
      >
        <svg width={32} height={32} fill="none" viewBox="0 0 24 24" stroke="#ED6A0F" strokeWidth={2} className="drop-shadow">
          <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={9} cy={21} r={1} />
          <circle cx={20} cy={21} r={1} />
        </svg>
        {carrito.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#ED6A0F] text-white text-xs font-bold px-2 py-0.5 rounded-full border-2 border-white">{carrito.length}</span>
        )}
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl" onClick={handleClose}>×</button>
            <h2 className="text-xl font-bold mb-4 text-[#ED6A0F]">Carrito de compras</h2>
            {stockError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {stockError}
              </div>
            )}
            {carrito.length === 0 ? (
              <div className="text-center text-gray-500">No hay productos en el carrito.</div>
            ) : (
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {carrito.map((p) => (
                  <div key={p.id} className="flex items-center gap-4 border-b pb-2">
                    <img src={p.imagenUrl} alt={p.nombre} className="w-16 h-16 object-contain rounded" />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">{p.nombre}</div>
                      <div className="text-sm text-gray-500">${Number(p.precio).toFixed(2)}</div>
                      <div className="text-xs text-gray-400">Stock disponible: {p.stock_disponible}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => updateCantidad(p.id, p.cantidad - 1)} 
                        className="px-2 py-1 bg-gray-200 rounded text-lg font-bold hover:bg-gray-300 transition-colors"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min={1}
                        max={p.stock_disponible}
                        value={p.cantidad}
                        onChange={e => updateCantidad(p.id, Number(e.target.value))}
                        className="w-12 text-center border rounded"
                      />
                      <button 
                        onClick={() => updateCantidad(p.id, p.cantidad + 1)} 
                        className="px-2 py-1 bg-gray-200 rounded text-lg font-bold hover:bg-gray-300 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <div className="w-20 text-right font-semibold">${subtotal(p).toFixed(2)}</div>
                    <button onClick={() => handleRemove(p.id)} className="ml-2 text-red-500 hover:text-red-700">✕</button>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-6 flex justify-between items-center">
              <div className="text-lg font-bold">Total:</div>
              <div className="text-2xl font-bold text-[#ED6A0F]">${total.toFixed(2)}</div>
            </div>
            <button
              className="mt-6 w-full py-3 rounded-lg font-bold text-white text-lg shadow-md transition-colors bg-[#ED6A0F] hover:bg-[#ED6A0F]/90 disabled:opacity-50"
              onClick={handleComprar}
              disabled={carrito.length === 0}
            >
              Comprar
            </button>
          </div>
        </div>
      )}
    </>
  );
} 