export interface Product {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  es_destacado: boolean;
  stock: number;
  punto_extra: number;
  estado: boolean;
  updatedAt: string;
  createdAt: string;
  imagenUrl: string;
}