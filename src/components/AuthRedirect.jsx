import { Navigate } from 'react-router-dom';
import { getAccessToken } from '../Data/local/tokenUtils'; // same as ProtectedRoute

const AuthRedirect = () => {
  const token = getAccessToken();
  return token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />;
};

export default AuthRedirect;
