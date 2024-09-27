import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const authToken = Cookies.get('auth-token');

  if (!authToken) {
    return <Navigate to='/login' />;
  }

  return children;
};

export default ProtectedRoute;
