import { useState } from 'react';
import type { Producto } from '../types';

export function NewProformaPage() {
  const [usarClienteExistente, setUsarClienteExistente] = useState(true);
  const [productos, setProductos] = useState<Producto[]>([
    { codigo: '', descripcion: '', cantidad: 1, precio: 0 },
  ]);
  const [loading, setLoading] = useState(false);

  const addRow = () => {
    setProductos(prev => [...prev, { codigo: '', descripcion: '', cantidad: 1, precio: 0 }]);
  };

  const updateRow = (index: number, field: keyof Producto, value: string | number) => {
    setProductos(prev => 
      prev.map((producto, i) => 
        i === index 
          ? { ...producto, [field]: field === 'cantidad' || field === 'precio' ? Number(value) : value }
          : producto
      )
    );
  };

  const removeRow = (index: number) => {
    if (productos.length > 1) {
      setProductos(prev => prev.filter((_, i) => i !== index));
    }
  };

  const onSave = async () => {
    setLoading(true);
    
    try {
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Guardar proforma (mock)', { usarClienteExistente, productos });
      alert('Proforma guardada exitosamente (mock)');
      
      // Redirigir al listado
      window.location.href = import.meta.env.BASE_URL + 'proformas';
    } catch (error) {
      alert('Error al guardar la proforma');
    } finally {
      setLoading(false);
    }
  };

  const total = productos.reduce((sum, producto) => sum + (producto.cantidad * producto.precio), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Nueva Proforma</h1>
        <button 
          onClick={() => window.history.back()}
          className="btn"
        >
          ← Volver
        </button>
      </div>
      
      {/* Selección de cliente */}
      <div className="card p-4">
        <h2 className="text-lg font-semibold mb-3">Información del Cliente</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <button 
            className={`flex-1 px-4 py-3 rounded-lg border text-sm sm:text-base transition-colors ${
              usarClienteExistente 
                ? 'bg-[--color-accent] text-black border-[--color-accent]' 
                : 'bg-white dark:bg-black border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`} 
            onClick={() => setUsarClienteExistente(true)}
          >
            Usar cliente por documento
          </button>
          <button 
            className={`flex-1 px-4 py-3 rounded-lg border text-sm sm:text-base transition-colors ${
              !usarClienteExistente 
                ? 'bg-[--color-accent] text-black border-[--color-accent]' 
                : 'bg-white dark:bg-black border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`} 
            onClick={() => setUsarClienteExistente(false)}
          >
            Ingresar cliente manual
          </button>
        </div>
      </div>
      
      {/* Campos de fecha y estado */}
      <div className="card p-4">
        <h2 className="text-lg font-semibold mb-3">Información General</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Fecha de registro</label>
            <input 
              className="input w-full" 
              type="date" 
              defaultValue={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Fecha de entrega</label>
            <input 
              className="input w-full" 
              type="date" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Estado de entrega</label>
            <select className="input w-full">
              <option value="NO">NO</option>
              <option value="SI">SI</option>
              <option value="REPROGRAMADO">REPROGRAMADO</option>
              <option value="CANCELADO">CANCELADO</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Tabla de productos */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Productos</h2>
          <button 
            onClick={addRow}
            className="btn btn-accent"
          >
            + Agregar producto
          </button>
        </div>
        
        {/* Vista móvil: Cards */}
        <div className="block sm:hidden space-y-3">
          {productos.map((producto, index) => (
            <div key={index} className="border rounded-lg p-4 bg-white dark:bg-black">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium">Producto {index + 1}</span>
                {productos.length > 1 && (
                  <button 
                    className="px-2 py-1 border rounded text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" 
                    onClick={() => removeRow(index)}
                  >
                    🗑️
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 gap-3">
                <input 
                  className="input text-sm" 
                  placeholder="Código del producto" 
                  value={producto.codigo} 
                  onChange={(e) => updateRow(index, 'codigo', e.target.value)} 
                />
                <input 
                  className="input text-sm" 
                  placeholder="Descripción" 
                  value={producto.descripcion} 
                  onChange={(e) => updateRow(index, 'descripcion', e.target.value)} 
                />
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    className="input text-sm text-right" 
                    placeholder="Cantidad" 
                    type="number" 
                    min="1"
                    value={producto.cantidad} 
                    onChange={(e) => updateRow(index, 'cantidad', e.target.value)} 
                  />
                  <input 
                    className="input text-sm text-right" 
                    placeholder="Precio" 
                    type="number" 
                    step="0.01"
                    min="0"
                    value={producto.precio} 
                    onChange={(e) => updateRow(index, 'precio', e.target.value)} 
                  />
                </div>
                <div className="text-right font-medium text-sm">
                  Subtotal: S/ {(producto.cantidad * producto.precio).toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Vista desktop: Tabla */}
        <div className="hidden sm:block overflow-auto border rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-black/5 dark:bg-white/5">
              <tr>
                <th className="text-left p-3 min-w-[120px]">Código</th>
                <th className="text-left p-3 min-w-[200px]">Descripción</th>
                <th className="text-right p-3 min-w-[100px]">Cantidad</th>
                <th className="text-right p-3 min-w-[120px]">Precio</th>
                <th className="text-right p-3 min-w-[120px]">Subtotal</th>
                <th className="p-3 w-[60px]"></th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto, index) => (
                <tr key={index} className="border-t border-black/10 dark:border-white/10">
                  <td className="p-3">
                    <input 
                      className="input text-sm w-full" 
                      value={producto.codigo} 
                      onChange={(e) => updateRow(index, 'codigo', e.target.value)} 
                    />
                  </td>
                  <td className="p-3">
                    <input 
                      className="input text-sm w-full" 
                      value={producto.descripcion} 
                      onChange={(e) => updateRow(index, 'descripcion', e.target.value)} 
                    />
                  </td>
                  <td className="p-3 text-right">
                    <input 
                      className="input text-sm w-full text-right" 
                      type="number" 
                      min="1"
                      value={producto.cantidad} 
                      onChange={(e) => updateRow(index, 'cantidad', e.target.value)} 
                    />
                  </td>
                  <td className="p-3 text-right">
                    <input 
                      className="input text-sm w-full text-right" 
                      type="number" 
                      step="0.01"
                      min="0"
                      value={producto.precio} 
                      onChange={(e) => updateRow(index, 'precio', e.target.value)} 
                    />
                  </td>
                  <td className="p-3 text-right font-medium">
                    S/ {(producto.cantidad * producto.precio).toFixed(2)}
                  </td>
                  <td className="p-3 text-center">
                    {productos.length > 1 && (
                      <button 
                        className="px-2 py-1 border rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" 
                        onClick={() => removeRow(index)}
                      >
                        🗑️
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Total y botones de acción */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
            <p className="text-2xl font-bold text-[--color-primary]">
              S/ {total.toFixed(2)}
            </p>
          </div>
          
          <div className="flex gap-2">
            <button 
              className="btn px-6 py-3" 
              onClick={() => window.history.back()}
            >
              Cancelar
            </button>
            <button 
              className="btn btn-primary px-6 py-3" 
              onClick={onSave}
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar Proforma'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
