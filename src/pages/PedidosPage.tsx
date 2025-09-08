import { useEffect, useState } from 'react';
import { pedidosService } from '../services/api';
import type { Pedido } from '../types';

export function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPedidos = async () => {
      try {
        setLoading(true);
        const data = await pedidosService.getAll();
        setPedidos(data);
      } catch (err) {
        setError('Error al cargar los pedidos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPedidos();
  }, []);

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'LISTO':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'ALTA EMPAQUETAR':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'NO HAY STOCK':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getEntregaColor = (estado: string) => {
    switch (estado) {
      case 'SI':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'NO':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'REPROGRAMADO':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'CANCELADO':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[--color-primary]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="btn btn-primary"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Pedidos de Proformas</h1>
        <button 
          onClick={() => window.location.reload()}
          className="btn"
        >
          🔄 Actualizar
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pedidos.map((pedido) => (
          <div key={pedido.id} className="card p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-lg">{pedido.n}</h3>
              <span className="text-xs text-gray-500">ID: {pedido.id}</span>
            </div>
            
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Estado de entrega:</p>
                <span className={`px-2 py-1 rounded-full text-xs ${getEntregaColor(pedido.entrega)}`}>
                  {pedido.entrega}
                </span>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Empaquetación:</p>
                <span className={`px-2 py-1 rounded-full text-xs ${getEstadoColor(pedido.empaquetacion)}`}>
                  {pedido.empaquetacion || 'Sin estado'}
                </span>
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-t border-black/10 dark:border-white/10">
              <button 
                className="btn btn-primary w-full text-sm"
                onClick={() => window.location.href = `${import.meta.env.BASE_URL}proformas/${pedido.id}`}
              >
                Ver Detalles
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {pedidos.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No hay pedidos registrados</p>
        </div>
      )}
    </div>
  );
}
