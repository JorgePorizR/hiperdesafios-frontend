import { useState } from 'react';

interface Product {
  id: number;
  nombre: string;
  precio: number;
  imagenUrl: string;
  stock: number;
}

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [modal, setModal] = useState<null | 'added' | 'exists'>(null);

  const handleAddToCart = () => {
    const carritoRaw = sessionStorage.getItem('carrito');
    let carrito: any[] = carritoRaw ? JSON.parse(carritoRaw) : [];
    const exists = carrito.find((p) => p.id === product.id);
    if (exists) {
      setModal('exists');
      return;
    }
    const nuevoCarrito = [...carrito, {
      ...product,
      cantidad: 1,
      stock_disponible: product.stock
    }];
    sessionStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
    setModal('added');
  };

  return (
    <>
      <button
        className="bg-[#ED6A0F] text-white px-4 py-2 rounded-md hover:bg-[#ED6A0F]/80 transition-colors w-full font-bold text-lg shadow-md"
        onClick={handleAddToCart}
        disabled={product.stock <= 0}
      >
        Agregar al carrito
      </button>
      {/* Modal */}
      {modal === 'added' && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-xs">
            <div className="text-3xl mb-2 text-green-500">✔️</div>
            <div className="font-bold mb-2">¡Producto agregado al carrito!</div>
            <button
              className="mt-2 px-4 py-2 bg-[#ED6A0F] text-white rounded hover:bg-[#ED6A0F]/80"
              onClick={() => setModal(null)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
      {modal === 'exists' && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-xs">
            <div className="text-3xl mb-2 text-yellow-500">⚠️</div>
            <div className="font-bold mb-2">El producto ya fue agregado al carrito</div>
            <button
              className="mt-2 px-4 py-2 bg-[#ED6A0F] text-white rounded hover:bg-[#ED6A0F]/80"
              onClick={() => setModal(null)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
} 