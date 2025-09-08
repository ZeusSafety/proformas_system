import { useEffect, useState, useMemo } from 'react';
import { proformasService, productosService } from '../services/api';
import type { Proforma, Producto } from '../types';

export function ProformaDetailPage() {
  const [proforma, setProforma] = useState<Proforma | null>(null);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Obtener ID de la URL
  const id = Number(window.location.pathname.split('/').pop());

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Cargar proforma
        const proformaData = await proformasService.getById(id);
        if (!proformaData) {
          setError('Proforma no encontrada');
          return;
        }
        setProforma(proformaData);
        
        // Cargar productos
        const productosData = await productosService.getByProformaId(id);
        setProductos(productosData?.items || []);
        
      } catch (err) {
        setError('Error al cargar los datos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const total = useMemo(() => 
    productos.reduce((sum, producto) => sum + (producto.cantidad * producto.precio), 0), 
    [productos]
  );

  const handleGeneratePDF = () => {
    const content = `Proforma ${proforma?.n}
Cliente: ${proforma?.cliente}
Fecha: ${proforma?.fecha}
Estado: ${proforma?.entrega}

Productos:
${productos.map(p => `${p.codigo} - ${p.descripcion} x${p.cantidad} = S/ ${(p.cantidad * p.precio).toFixed(2)}`).join('\n')}

Total: S/ ${total.toFixed(2)}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${proforma?.n || 'proforma'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[--color-primary]"></div>
      </div>
    );
  }

  if (error || !proforma) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error || 'Proforma no encontrada'}</p>
        <button 
          onClick={() => window.history.back()} 
          className="btn btn-primary"
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header de la proforma */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{proforma.n}</h1>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <p><strong>Cliente:</strong> {proforma.cliente}</p>
            <p><strong>Fecha:</strong> {proforma.fecha}</p>
            <p><strong>Estado de entrega:</strong> 
              <span 
                className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  proforma.entrega === 'SI' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                    : proforma.entrega === 'NO'
                    ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                    : proforma.entrega === 'REPROGRAMADO'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
                }`}
              >
                {proforma.entrega}
              </span>
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => window.history.back()}
            className="btn"
          >
            ← Volver
          </button>
          <button
            onClick={handleGeneratePDF}
            className="btn btn-primary"
          >
            📄 Generar PDF
          </button>
        </div>
      </div>

      {/* Tabla de productos */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-black/10 dark:border-white/10">
          <h2 className="text-lg font-semibold">Productos</h2>
        </div>
        
        <div className="overflow-auto">
          <table className="table">
            <thead>
              <tr>
                <th className="th">Código</th>
                <th className="th">Descripción</th>
                <th className="th text-right">Cantidad</th>
                <th className="th text-right">Precio Unit.</th>
                <th className="th text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto, index) => (
                <tr key={`${producto.codigo}-${index}`}>
                  <td className="td font-mono">{producto.codigo}</td>
                  <td className="td">{producto.descripcion}</td>
                  <td className="td text-right">{producto.cantidad}</td>
                  <td className="td text-right">S/ {producto.precio.toFixed(2)}</td>
                  <td className="td text-right font-medium">
                    S/ {(producto.cantidad * producto.precio).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {productos.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No hay productos registrados para esta proforma
          </div>
        )}
      </div>

      {/* Total */}
      <div className="flex justify-end">
        <div className="bg-[--color-primary]/10 dark:bg-[--color-primary]/20 p-4 rounded-lg">
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
            <p className="text-2xl font-bold text-[--color-primary]">
              S/ {total.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
