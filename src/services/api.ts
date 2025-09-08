import type { Proforma, ProductosPorProforma, Pedido } from '../types';

// Función genérica para cargar JSON
async function fetchJSON<T>(path: string): Promise<T> {
  // Construir URL correctamente para GitHub Pages
  const baseUrl = import.meta.env.BASE_URL || '/proformas_system/';
  const url = new URL(path, window.location.origin + baseUrl).toString();
  
  const res = await fetch(url);
  
  if (!res.ok) {
    throw new Error(`Error al cargar ${path}: ${res.status}`);
  }
  
  return res.json();
}

// Servicios específicos
export const proformasService = {
  async getAll(): Promise<Proforma[]> {
    return fetchJSON<Proforma[]>('data/proformas.json');
  },
  
  async getById(id: number): Promise<Proforma | undefined> {
    const proformas = await this.getAll();
    return proformas.find(p => p.id === id);
  }
};

export const productosService = {
  async getByProformaId(proformaId: number): Promise<ProductosPorProforma | undefined> {
    const productos = await fetchJSON<ProductosPorProforma[]>('data/productos.json');
    return productos.find(p => p.proformaId === proformaId);
  }
};

export const pedidosService = {
  async getAll(): Promise<Pedido[]> {
    return fetchJSON<Pedido[]>('data/pedidos.json');
  }
};
