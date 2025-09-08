// Tipos principales de la aplicación

export interface Proforma {
  id: number;
  n: string;
  cliente: string;
  fecha: string;
  entrega: string;
}

export interface Producto {
  codigo: string;
  descripcion: string;
  cantidad: number;
  precio: number;
}

export interface ProductosPorProforma {
  proformaId: number;
  items: Producto[];
}

export interface Pedido {
  id: number;
  n: string;
  entrega: string;
  empaquetacion: string;
}

export interface Usuario {
  usuario: string;
  contraseña: string;
}

export type Theme = 'light' | 'dark';

export interface FormularioProforma {
  cliente: string;
  fechaRegistro: string;
  fechaEntrega: string;
  estadoEntrega: string;
  productos: Producto[];
}
