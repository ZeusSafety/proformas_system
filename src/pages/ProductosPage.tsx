import { useEffect, useState } from 'react';
import { productosService } from '../services/api';
import type { Producto } from '../types';

interface ProductoConInfo extends Producto {
  proformaId: number;
  cantidadUsada: number;
}

export function ProductosPage() {
  const [productos, setProductos] = useState<ProductoConInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadProductos = async () => {
      try {
        setLoading(true);
        
        // Cargar todos los productos de todas las proformas
        const allProductos: ProductoConInfo[] = [];
        
        // Simular carga de productos (en una implementación real, esto vendría de una API)
        for (let i = 1; i <= 5; i++) {
          try {
            const productosData = await productosService.getByProformaId(i);
            if (productosData) {
              productosData.items.forEach(item => {
                allProductos.push({
                  ...item,
                  proformaId: i,
                  cantidadUsada: item.cantidad,
                });
              });
            }
          } catch (error) {
            console.warn(`No se pudieron cargar productos para proforma ${i}`);
          }
        }
        
        setProductos(allProductos);
      } catch (error) {
        console.error('Error al cargar productos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProductos();
  }, []);

  // Agrupar productos por código y sumar cantidades
  const productosAgrupados = productos.reduce((acc, producto) => {
    const key = producto.codigo;
    if (!acc[key]) {
      acc[key] = {
        codigo: producto.codigo,
        descripcion: producto.descripcion,
        precio: producto.precio,
        cantidadTotal: 0,
        proformas: [],
      };
    }
    acc[key].cantidadTotal += producto.cantidad;
    acc[key].proformas.push({
      proformaId: producto.proformaId,
      cantidad: producto.cantidad,
    });
    return acc;
  }, {} as Record<string, {
    codigo: string;
    descripcion: string;
    precio: number;
    cantidadTotal: number;
    proformas: Array<{ proformaId: number; cantidad: number }>;
  }>);

  const productosFiltrados = Object.values(productosAgrupados).filter(producto =>
    producto.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[--color-primary]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Productos</h1>
        <button 
          onClick={() => window.location.reload()}
          className="btn"
        >
          🔄 Actualizar
        </button>
      </div>

      {/* Buscador */}
      <div className="card p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar por código o descripción..."
              className="input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {productosFiltrados.length} productos encontrados
          </div>
        </div>
      </div>

      {/* Lista de productos */}
      <div className="space-y-4">
        {productosFiltrados.map((producto) => (
          <div key={producto.codigo} className="card p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold">{producto.codigo}</h3>
                  <span className="px-2 py-1 bg-[--color-primary]/10 text-[--color-primary] rounded-full text-xs font-medium">
                    {producto.proformas.length} proforma{producto.proformas.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-2">{producto.descripcion}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="font-medium">Precio: S/ {producto.precio.toFixed(2)}</span>
                  <span className="font-medium">Cantidad Total: {producto.cantidadTotal}</span>
                  <span className="font-bold text-[--color-primary]">
                    Valor Total: S/ {(producto.cantidadTotal * producto.precio).toFixed(2)}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <button 
                  className="btn btn-primary text-sm"
                  onClick={() => {
                    const baseUrl = import.meta.env.BASE_URL || '/proformas_system/';
                    window.location.href = `${baseUrl}proformas/${producto.proformas[0].proformaId}`;
                  }}
                >
                  Ver Proforma
                </button>
              </div>
            </div>
            
            {/* Detalle de proformas */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Usado en proformas:
              </h4>
              <div className="flex flex-wrap gap-2">
                {producto.proformas.map((proforma) => (
                  <span 
                    key={proforma.proformaId}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs"
                  >
                    PF-{String(proforma.proformaId).padStart(4, '0')} (x{proforma.cantidad})
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {productosFiltrados.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No se encontraron productos</p>
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="btn btn-primary mt-4"
            >
              Limpiar búsqueda
            </button>
          )}
        </div>
      )}
    </div>
  );
}