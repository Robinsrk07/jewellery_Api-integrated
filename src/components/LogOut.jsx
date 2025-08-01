import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearTokens } from '../Data/local/tokenUtils';
import { logout } from '../StateManagement/authSlice';
import { persistor } from '../StateManagement/store';
import AuthModel from '../models/authModels';
const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get refresh token from Redux state (or fallback to localStorage if needed)
  const refresh = useSelector((state) => state.auth.refresh);
  // const refresh = localStorage.getItem('refreshToken'); // fallback if needed

  useEffect(() => {
    const performLogout = async () => {
      try {
        if (refresh) {
          await AuthModel.logOut({ refresh });
        }
      } catch (error) {
        console.error('Logout API failed:', error);
      } finally {
        clearTokens();          // clear localStorage/sessionStorage
        dispatch(logout());     // reset auth state
        persistor.purge();      // clear redux-persist store
        navigate('/login', { replace: true });
      }
    };

    performLogout();
  }, [dispatch, navigate, refresh]);

  return null;
};

export default Logout;
