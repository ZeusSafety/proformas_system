import { Navigate } from 'react-router-dom';

interface GuardProps {
  children: React.ReactElement;
}

export function Guard({ children }: GuardProps) {
  const isAuthed = localStorage.getItem('auth') === '1';
  
  if (!isAuthed) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}
