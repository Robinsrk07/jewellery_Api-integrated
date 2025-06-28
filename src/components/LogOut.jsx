// src/pages/Logout.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearTokens } from '../Data/local/tokenUtils'; // token cleanup
import { useDispatch } from 'react-redux';
import { logout } from '../StateManagement/authSlice';
import { persistor } from '../StateManagement/store'; // 👈 import persistor

const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    clearTokens();          // ✅ clears manual tokens
    dispatch(logout());     // ✅ resets Redux `auth` state
    persistor.purge();      // ✅ clears persisted Redux store (localStorage)
    navigate('/login', { replace: true });
  }, [dispatch, navigate]);

  return null;
};

export default Logout;
