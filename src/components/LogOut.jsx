// src/pages/Logout.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearTokens } from '../Data/local/tokenUtils'; // adjust path if needed
import { useDispatch } from 'react-redux';
import { logout } from '../StateManagement/authSlice';

const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    clearTokens();
    dispatch(logout()); // create this action in your authSlice
    navigate('/login', { replace: true }); // redirect to login page
  }, [dispatch, navigate]);

  return null;
};

export default Logout;
