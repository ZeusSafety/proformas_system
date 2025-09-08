import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

// Importar componentes
import { Layout } from './components/Layout';
import { Guard } from './components/Guard';
import { LoginPage } from './pages/LoginPage';
import { ProformasListPage } from './pages/ProformasListPage';
import { ProformaDetailPage } from './pages/ProformaDetailPage';
import { NewProformaPage } from './pages/NewProformaPage';
import { PedidosPage } from './pages/PedidosPage';

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
  );
}
