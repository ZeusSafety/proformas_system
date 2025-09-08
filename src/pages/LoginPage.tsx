import { useState } from 'react';
import { requestFcmToken } from '../firebase';

export function LoginPage() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!user || !pass) {
      setError('Usuario y contraseña requeridos');
      return;
    }
    
    setLoading(true);
    
    try {
      // Simular autenticación
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      localStorage.setItem('auth', '1');
      
      // Solicitar permisos de notificaciones
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          await requestFcmToken();
        }
      }
      
      // Redirigir
      const baseUrl = import.meta.env.BASE_URL || '/proformas_system/';
      window.location.href = baseUrl + 'proformas';
    } catch (err) {
      setError('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-[--color-primary] mb-2">⚡ Proformas</h1>
        <p className="text-gray-600 dark:text-gray-400">Inicia sesión para continuar</p>
      </div>
      
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <input 
            className="input w-full" 
            placeholder="Usuario" 
            value={user} 
            onChange={(e) => setUser(e.target.value)}
            disabled={loading}
            autoComplete="username"
          />
        </div>
        
        <div>
          <input 
            className="input w-full" 
            placeholder="Contraseña" 
            type="password" 
            value={pass} 
            onChange={(e) => setPass(e.target.value)}
            disabled={loading}
            autoComplete="current-password"
          />
        </div>
        
        {error && (
          <div className="text-red-600 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded">
            {error}
          </div>
        )}
        
        <button 
          className="btn btn-primary w-full py-3" 
          disabled={loading}
          type="submit"
        >
          {loading ? 'Iniciando sesión...' : 'Entrar'}
        </button>
      </form>
      
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Demo: Usa cualquier usuario y contraseña</p>
      </div>
    </div>
  );
}
