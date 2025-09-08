import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import './index.css'
import { requestFcmToken } from './firebase'

function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('theme') as 'light' | 'dark') || 'light')
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])
  return { theme, toggle: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')) }
}

function useOnline() {
  const [online, setOnline] = useState<boolean>(navigator.onLine)
  useEffect(() => {
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])
  return online
}

function Layout({ children }: { children: React.ReactNode }) {
  const { theme, toggle } = useTheme()
  const online = useOnline()
  return (
    <div className="min-h-full flex flex-col bg-gradient-to-b from-white to-zinc-50 dark:from-black dark:to-zinc-950 text-black dark:text-white">
      <header className="sticky top-0 z-10 border-b border-black/10 dark:border-white/10 bg-white/80 dark:bg-black/70 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/proformas" className="flex items-center gap-2 font-bold text-lg text-[--color-primary]">
            ⚡ Proformas
          </Link>
          <div className="flex items-center gap-3">
            <span className={`text-xs px-2 py-1 rounded ${online ? 'bg-green-500/20 text-green-700 dark:text-green-300' : 'bg-red-500/20 text-red-700 dark:text-red-300'}`}>{online ? 'Online' : 'Offline'}</span>
            <button onClick={toggle} className="btn">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        <div className="grid gap-6">
          {children}
        </div>
      </main>
      <footer className="border-t border-black/10 dark:border-white/10 text-center py-4 text-sm">© 2025 Tu Empresa</footer>
    </div>
  )
}

// Mock data
// Carga mock desde JSON público (cacheable offline por PWA)
async function fetchJSON<T>(path: string): Promise<T> {
  const url = new URL(path.replace(/^\//, ''), import.meta.env.BASE_URL).toString()
  const res = await fetch(url)
  return res.json()
}

function LoginPage() {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !pass) return setError('Usuario y contraseña requeridos')
    localStorage.setItem('auth', '1')
    Notification.requestPermission().then((res) => {
      if (res === 'granted') requestFcmToken()
    })
    window.location.href = import.meta.env.BASE_URL + 'proformas'
  }
  return (
    <div className="max-w-sm mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Iniciar sesión</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border rounded px-3 py-2" placeholder="Usuario" value={user} onChange={(e) => setUser(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" placeholder="Contraseña" type="password" value={pass} onChange={(e) => setPass(e.target.value)} />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="bg-[--color-primary] text-white rounded px-4 py-2 w-full">Entrar</button>
      </form>
    </div>
  )
}

function Guard({ children }: { children: React.ReactElement }) {
  const isAuthed = localStorage.getItem('auth') === '1'
  if (!isAuthed) return <Navigate to="/login" replace />
  return children
}

function ProformasListPage() {
  const [rows, setRows] = useState<Array<{ id: number; n: string; cliente: string; fecha: string; entrega: string }>>([])
  useEffect(() => {
    fetchJSON<typeof rows>('data/proformas.json').then(setRows).catch(() => setRows([]))
  }, [])
  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Proformas</h1>
        <Link to="/proformas/nueva" className="btn btn-accent">+ Nueva</Link>
      </div>
      <div className="overflow-auto card">
        <table className="table">
          <thead>
            <tr>
              <th className="th">N° Proforma</th>
              <th className="th">Cliente</th>
              <th className="th">Estado entrega</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer" onClick={() => (window.location.href = `${import.meta.env.BASE_URL}proformas/${p.id}`)}>
                <td className="td">{p.n}</td>
                <td className="td">{p.cliente}</td>
                <td className="td">{p.entrega}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ProformaDetailPage() {
  const id = Number(window.location.pathname.split('/').pop())
  const [proforma, setProforma] = useState<{ id: number; n: string; cliente: string; fecha: string; entrega: string } | null>(null)
  const [rows, setRows] = useState<Array<{ codigo: string; descripcion: string; cantidad: number; precio: number }>>([])
  useEffect(() => {
    fetchJSON<Array<{ id: number; n: string; cliente: string; fecha: string; entrega: string }>>('data/proformas.json').then((list) => setProforma(list.find((p) => p.id === id) || null))
    fetchJSON<Array<{ proformaId: number; items: Array<{ codigo: string; descripcion: string; cantidad: number; precio: number }> }>>('data/productos.json').then((all) => setRows(all.find((x) => x.proformaId === id)?.items || []))
  }, [id])
  const total = useMemo(() => rows.reduce((s, r) => s + r.cantidad * r.precio, 0), [rows])
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{proforma?.n}</h1>
          <p className="text-sm opacity-80">Cliente: {proforma?.cliente} · Fecha: {proforma?.fecha}</p>
          <p className="text-sm">Entrega: {proforma?.entrega}</p>
        </div>
        <button
          onClick={() => {
            const content = `Proforma ${proforma?.n}\nCliente: ${proforma?.cliente}\nFecha: ${proforma?.fecha}\nTotal: S/ ${total.toFixed(2)}`
            const blob = new Blob([content], { type: 'application/pdf' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${proforma?.n || 'proforma'}.pdf`
            a.click()
            URL.revokeObjectURL(url)
          }}
          className="btn btn-primary"
        >
          Generar/Actualizar PDF
        </button>
      </div>
      <div className="overflow-auto card">
        <table className="table">
          <thead>
            <tr>
              <th className="th">Código</th>
              <th className="th">Descripción</th>
              <th className="th text-right">Cantidad</th>
              <th className="th text-right">Precio</th>
              <th className="th text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.codigo}>
                <td className="td">{r.codigo}</td>
                <td className="td">{r.descripcion}</td>
                <td className="td text-right">{r.cantidad}</td>
                <td className="td text-right">{r.precio.toFixed(2)}</td>
                <td className="td text-right">{(r.cantidad * r.precio).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-right font-semibold">Total: S/ {total.toFixed(2)}</div>
    </div>
  )
}

function NewProformaPage() {
  const [usarClienteExistente, setUsarClienteExistente] = useState(true)
  const [productos, setProductos] = useState<Array<{ codigo: string; descripcion: string; cantidad: number; precio: number }>>([
    { codigo: '', descripcion: '', cantidad: 1, precio: 0 },
  ])
  const addRow = () => setProductos((p) => [...p, { codigo: '', descripcion: '', cantidad: 1, precio: 0 }])
  const updateRow = (i: number, field: string, value: string) => {
    setProductos((rows) => rows.map((r, idx) => (idx === i ? { ...r, [field]: field === 'cantidad' || field === 'precio' ? Number(value) : value } : r)))
  }
  const onSave = () => {
    console.log('Guardar proforma (mock)', { usarClienteExistente, productos })
    alert('Proforma guardada (mock)')
  }
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Nueva Proforma</h1>
      
      {/* Botones de selección de cliente - Responsive */}
      <div className="flex flex-col sm:flex-row gap-2">
        <button 
          className={`flex-1 px-3 py-2 rounded border text-sm sm:text-base ${usarClienteExistente ? 'bg-[--color-accent]' : 'bg-white dark:bg-black'}`} 
          onClick={() => setUsarClienteExistente(true)}
        >
          Usar cliente por documento
        </button>
        <button 
          className={`flex-1 px-3 py-2 rounded border text-sm sm:text-base ${!usarClienteExistente ? 'bg-[--color-accent]' : 'bg-white dark:bg-black'}`} 
          onClick={() => setUsarClienteExistente(false)}
        >
          Ingresar cliente manual
        </button>
      </div>
      
      {/* Campos de fecha y estado - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <input className="border rounded px-3 py-2" type="date" placeholder="Fecha registro" />
        <input className="border rounded px-3 py-2" type="date" placeholder="Fecha entrega" />
        <select className="border rounded px-3 py-2">
          <option>SI</option>
          <option>NO</option>
          <option>REPROGRAMADO</option>
          <option>CANCELADO</option>
        </select>
      </div>
      
      {/* Tabla de productos - Mobile First */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Productos</h3>
        
        {/* Vista móvil: Cards */}
        <div className="block sm:hidden space-y-3">
          {productos.map((r, i) => (
            <div key={i} className="border rounded p-3 space-y-2 bg-white dark:bg-black">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Producto {i + 1}</span>
                <button 
                  className="px-2 py-1 border rounded text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" 
                  onClick={() => setProductos((rows) => rows.filter((_, idx) => idx !== i))}
                >
                  🗑️
                </button>
              </div>
              <div className="grid grid-cols-1 gap-2">
                <input 
                  className="w-full border rounded px-2 py-1 text-sm" 
                  placeholder="Código" 
                  value={r.codigo} 
                  onChange={(e) => updateRow(i, 'codigo', e.target.value)} 
                />
                <input 
                  className="w-full border rounded px-2 py-1 text-sm" 
                  placeholder="Descripción" 
                  value={r.descripcion} 
                  onChange={(e) => updateRow(i, 'descripcion', e.target.value)} 
                />
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    className="border rounded px-2 py-1 text-sm text-right" 
                    placeholder="Cantidad" 
                    type="number" 
                    value={r.cantidad} 
                    onChange={(e) => updateRow(i, 'cantidad', e.target.value)} 
                  />
                  <input 
                    className="border rounded px-2 py-1 text-sm text-right" 
                    placeholder="Precio" 
                    type="number" 
                    step="0.01" 
                    value={r.precio} 
                    onChange={(e) => updateRow(i, 'precio', e.target.value)} 
                  />
                </div>
                <div className="text-right font-medium text-sm">
                  Subtotal: S/ {(r.cantidad * r.precio).toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Vista desktop: Tabla */}
        <div className="hidden sm:block overflow-auto border rounded">
          <table className="w-full text-sm">
            <thead className="bg-black/5 dark:bg-white/5">
              <tr>
                <th className="text-left p-2 min-w-[100px]">Código</th>
                <th className="text-left p-2 min-w-[200px]">Descripción</th>
                <th className="text-right p-2 min-w-[80px]">Cantidad</th>
                <th className="text-right p-2 min-w-[100px]">Precio</th>
                <th className="text-right p-2 min-w-[100px]">Subtotal</th>
                <th className="p-2 w-[60px]"></th>
              </tr>
            </thead>
            <tbody>
              {productos.map((r, i) => (
                <tr key={i}>
                  <td className="p-2"><input className="w-full border rounded px-2 py-1 text-sm" value={r.codigo} onChange={(e) => updateRow(i, 'codigo', e.target.value)} /></td>
                  <td className="p-2"><input className="w-full border rounded px-2 py-1 text-sm" value={r.descripcion} onChange={(e) => updateRow(i, 'descripcion', e.target.value)} /></td>
                  <td className="p-2 text-right"><input className="w-full border rounded px-2 py-1 text-sm text-right" type="number" value={r.cantidad} onChange={(e) => updateRow(i, 'cantidad', e.target.value)} /></td>
                  <td className="p-2 text-right"><input className="w-full border rounded px-2 py-1 text-sm text-right" type="number" step="0.01" value={r.precio} onChange={(e) => updateRow(i, 'precio', e.target.value)} /></td>
                  <td className="p-2 text-right font-medium">{(r.cantidad * r.precio).toFixed(2)}</td>
                  <td className="p-2 text-right"><button className="px-2 py-1 border rounded hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => setProductos((rows) => rows.filter((_, idx) => idx !== i))}>🗑️</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Botones de acción - Responsive */}
      <div className="flex flex-col sm:flex-row gap-2">
        <button 
          className="flex-1 px-3 py-2 border rounded hover:bg-gray-50 dark:hover:bg-gray-800" 
          onClick={addRow}
        >
          + Agregar producto
        </button>
        <button 
          className="flex-1 px-3 py-2 bg-[--color-primary] text-white rounded hover:opacity-90" 
          onClick={onSave}
        >
          Guardar Proforma
        </button>
      </div>
    </div>
  )
}

function PedidosPage() {
  const [pedidos, setPedidos] = useState<Array<{ id: number; n: string; entrega: string; empaquetacion: string }>>([])
  useEffect(() => {
    fetchJSON<typeof pedidos>('data/pedidos.json').then(setPedidos).catch(() => setPedidos([]))
  }, [])
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Pedidos de Proformas</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pedidos.map((p) => (
          <div key={p.id} className="border rounded p-4 bg-white dark:bg-black">
            <div className="font-semibold">{p.n}</div>
            <div className="text-sm">Entrega: {p.entrega}</div>
            <div className="text-sm">Empaquetación: {p.empaquetacion}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Layout>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/proformas" element={<Guard><ProformasListPage /></Guard>} />
          <Route path="/proformas/nueva" element={<Guard><NewProformaPage /></Guard>} />
          <Route path="/proformas/:id" element={<Guard><ProformaDetailPage /></Guard>} />
          <Route path="/pedidos" element={<Guard><PedidosPage /></Guard>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
