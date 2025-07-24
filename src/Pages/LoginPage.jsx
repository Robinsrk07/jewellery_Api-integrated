import React, { useEffect, useState } from 'react';
import welcomeImage from '../assets/images/5842ecaa-891f-40c4-acd5-599fce52d694.jpg';
import '@fontsource/open-sans';
import '@fontsource/open-sans/600.css';
import '@fontsource/open-sans/700.css';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import AuthModel from '../models/authModels';
import { setLogin } from '../StateManagement/authSlice';
import { setToken } from '../Data/local/tokenUtils';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

 
  const [errors, setErrors] = useState({});
  const [logOut, setLogOut] = useState(false);
  const [userCredentials, setUserCredentials] = useState({
    email: '',
    password: '',
    ip_address: ''
  });

  const handleSignIn = async (e) => {
    e.preventDefault();

    const newErrors = {};
if (!userCredentials.email) newErrors.email = "Email is required.";
    if (!userCredentials.password) newErrors.password = "Password is required.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    try {
      const response = await AuthModel.login(userCredentials.email,userCredentials.password,userCredentials.ip_address);
      console.log(response.data);
      
       const { access, refresh ,data} = response.data
       setToken({ access, refresh });
      dispatch(setLogin({
      login_type: data.login_type, 
      login_id: data.login_id,
      manage_user_type: data.manage_user_type,
      can_manage_user_types: data.can_manage_user_types || {},
      user_permissions: data.user_permissions || [],
      first_name: data.first_name || '',
      last_name: data.last_name || '',
      refresh: refresh, // Using the refresh token from response
      is_superadmin: data.is_superadmin,
      is_account_active: data.is_account_active
    }));
      navigate('/dashboard'); // redirect after successful login
    } catch (err) {
      console.log(err)
      const errorMsg = err?.response?.data?.message || 'Login failed. Please try again.';
      setErrors({ common: errorMsg });
    }
  };

  useEffect(() => {
    const fetchIpAddress = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setUserCredentials((prev) => ({
          ...prev,
          ip_address: data.ip
        }));
      } catch (error) {
        console.error('Failed to fetch IP address', error);
      }
    };
    fetchIpAddress();
  }, []);

  return (
    <div className='w-full h-full bg-white flex flex-col md:flex-row font-sans'>
      <div className="w-full md:w-1/2 bg-white flex flex-col items-center pt-[92px]" style={{ paddingTop: '90px' }}>
        {logOut && (
          <div className='w-[55%] h-[30%] bg-blue-600 flex flex-col text-center justify-center pt-5 rounded' style={{ fontFamily: "Open Sans" }}>
            You are logged out successfully.
          </div>
        )}

        <div className="w-full max-w-[300px]">
            {errors.common && (
    <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 w-full text-center flex items-center justify-center h-[50px]">
      {errors.common}
    </div>
  )}
          <h1 className="text-[1.65rem] font-bold mb-4 text-gray-700 tracking-tight leading-relaxed" style={{ fontFamily: "Open Sans" }}>Sign In</h1>
          <p className="text-gray-500 text-[16px]" style={{ paddingTop: '10px', marginBottom: '30px', fontFamily: "Open Sans" }}>
            Enter your username and password to<br /> sign in
          </p>

       

          <div className="flex flex-col justify-center">
            {errors.email && (
  <p className="text-red-500 text-xs mb-1">{errors.email}</p>
)}
           <input
              type="text"
              name="email" // Important for dynamic error clearing
              value={userCredentials.email}
              onChange={(e) => {
                const { name, value } = e.target;
                setUserCredentials((prev) => ({ ...prev, [name]: value }));
                setErrors((prev) => ({ ...prev, [name]: '' }));
              }}
              placeholder="User Name"
              className="input input-md text-[16px] border-b bg-white border-gray-300 focus:outline-none focus:border-blue-500 rounded-md placeholder-gray-400 text-black"
              style={{ paddingLeft: '10px', height: '50px', marginBottom: '15px', width: '300px' }}
            />

          </div>

          

          <div className="flex flex-col justify-center">
            {errors.password && (
              <p className="text-red-500 text-xs mb-1">{errors.password}</p>
            )}
            <input
              type="password"
              name="password" 
              placeholder="Password"
              value={userCredentials.password}
              onChange={(e) => {
                const { name, value } = e.target;
                setUserCredentials((prev) => ({ ...prev, [name]: value }));
                setErrors((prev) => ({ ...prev, [name]: '' }));
              }}
              className="input input-md text-[16px] border-b bg-white border-gray-300 focus:outline-none focus:border-blue-500 rounded-md placeholder-gray-400 text-black"
              style={{ paddingLeft: '10px', height: '50px', width: '300px' }}
              required
            />
          </div>


          <div className="flex ">
            <fieldset className="fieldset bg-white rounded-box p-4" style={{ marginTop: '17px' }}>
              <label className="label items-center gap-2">
                <input
                  type="checkbox"
                  defaultChecked
                  className="toggle border-gray-100 bg-gray-400 checked:bg-blue-500 bg-gray-200"
                  style={{ width: '40px', height: '20px' }}
                />
                <span className="text-gray-500 text-[1rem]" style={{ fontFamily: "Open Sans" }}>Remember me</span>
              </label>
            </fieldset>
          </div>

          <div className="flex justify-center">
            <button
              className="btn btn-primary  border-none bg-[#5E72E4] rounded-lg"
              style={{ marginTop: '20px', height: '50px', width: '300px', fontFamily: "Open Sans" }}
              onClick={handleSignIn}
            >
              Sign In
            </button>
          </div>

          <div className="flex justify-center">
            <p
              className="text-gray-500 text-[15px]"
              style={{ paddingTop: '23px', marginBottom: '30px', fontFamily: "Open Sans" }}
            >
              Don't have an account?{' '}
              <span className="text-blue-500 font-semibold cursor-pointer">Sign up</span>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden md:flex md:w-1/2 bg-white items-center justify-center">
        <div className="w-[95%] aspect-[3.4/3]">
          <img
            src={welcomeImage}
            alt="Welcome"
            className='w-full h-full object-cover rounded-lg shadow-md'
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
