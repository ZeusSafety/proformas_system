import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { proformasService } from '../services/api';
import type { Proforma } from '../types';

export function ProformasListPage() {
  const [proformas, setProformas] = useState<Proforma[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProformas = async () => {
      try {
        setLoading(true);
        const data = await proformasService.getAll();
        setProformas(data);
      } catch (err) {
        setError('Error al cargar las proformas');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProformas();
  }, []);

  const handleProformaClick = (id: number) => {
    const baseUrl = import.meta.env.BASE_URL || '/proformas_system/';
    window.location.href = `${baseUrl}proformas/${id}`;
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
    <div className="grid gap-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Proformas</h1>
        <Link to="/proformas/nueva" className="btn btn-accent">
          + Nueva Proforma
        </Link>
      </div>
      
      <div className="overflow-auto card">
        <table className="table">
          <thead>
            <tr>
              <th className="th">N° Proforma</th>
              <th className="th">Cliente</th>
              <th className="th">Fecha</th>
              <th className="th">Estado entrega</th>
            </tr>
          </thead>
          <tbody>
            {proformas.map((proforma) => (
              <tr 
                key={proforma.id} 
                className="hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors"
                onClick={() => handleProformaClick(proforma.id)}
              >
                <td className="td font-medium">{proforma.n}</td>
                <td className="td">{proforma.cliente}</td>
                <td className="td">{proforma.fecha}</td>
                <td className="td">
                  <span 
                    className={`px-2 py-1 rounded-full text-xs ${
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {proformas.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No hay proformas registradas</p>
          <Link to="/proformas/nueva" className="btn btn-primary mt-4">
            Crear primera proforma
          </Link>
        </div>
      )}
    </div>
  );
}
