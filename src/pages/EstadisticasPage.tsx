import { useEffect, useState } from 'react';
import { proformasService, pedidosService } from '../services/api';

export function EstadisticasPage() {
  const [stats, setStats] = useState({
    totalProformas: 0,
    proformasEntregadas: 0,
    proformasPendientes: 0,
    totalPedidos: 0,
    pedidosListos: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        
        const [proformas, pedidos] = await Promise.all([
          proformasService.getAll(),
          pedidosService.getAll()
        ]);

        const totalProformas = proformas.length;
        const proformasEntregadas = proformas.filter(p => p.entrega === 'SI').length;
        const proformasPendientes = proformas.filter(p => p.entrega === 'NO').length;
        const totalPedidos = pedidos.length;
        const pedidosListos = pedidos.filter(p => p.empaquetacion === 'LISTO').length;

        setStats({
          totalProformas,
          proformasEntregadas,
          proformasPendientes,
          totalPedidos,
          pedidosListos,
        });
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

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
        <h1 className="text-2xl font-semibold">Estadísticas</h1>
        <button 
          onClick={() => window.location.reload()}
          className="btn"
        >
          🔄 Actualizar
        </button>
      </div>

      {/* Cards de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Proformas</p>
              <p className="text-3xl font-bold text-[--color-primary]">{stats.totalProformas}</p>
            </div>
            <div className="text-4xl">📄</div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Entregadas</p>
              <p className="text-3xl font-bold text-green-600">{stats.proformasEntregadas}</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pendientes</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.proformasPendientes}</p>
            </div>
            <div className="text-4xl">⏳</div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Pedidos</p>
              <p className="text-3xl font-bold text-blue-600">{stats.totalPedidos}</p>
            </div>
            <div className="text-4xl">📦</div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Listos para Envío</p>
              <p className="text-3xl font-bold text-green-600">{stats.pedidosListos}</p>
            </div>
            <div className="text-4xl">🚚</div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tasa de Entrega</p>
              <p className="text-3xl font-bold text-[--color-primary]">
                {stats.totalProformas > 0 ? Math.round((stats.proformasEntregadas / stats.totalProformas) * 100) : 0}%
              </p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
        </div>
      </div>

      {/* Gráfico simple */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4">Resumen de Estados</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Proformas Entregadas</span>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${stats.totalProformas > 0 ? (stats.proformasEntregadas / stats.totalProformas) * 100 : 0}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium">{stats.proformasEntregadas}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Proformas Pendientes</span>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full" 
                  style={{ width: `${stats.totalProformas > 0 ? (stats.proformasPendientes / stats.totalProformas) * 100 : 0}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium">{stats.proformasPendientes}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}