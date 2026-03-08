import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router';
import type { AxiosResponse } from 'axios';
import { jwtDecode } from 'jwt-decode';
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/login/LoginPage';
import RegisterPage from './pages/register/RegisterPage';
import { normalAxios } from './axiosInstance';
import { getToken } from './tokenManager';
import UserContext from './contexts/UserContext';
import './App.css'

function App() {
  const [user, setUser] = useState<string | null>(null);

  const reloadUser = async () => {
    const token = getToken();
    if (token) {
      const payload = jwtDecode(token) as { userId: string };
      const id = payload.userId;

      const response: AxiosResponse = await normalAxios.get(`/api/accounts/${id}`);
      if (response.status === 200) {
        console.log(response.data.username);
        setUser(response.data.username);
      }
      else {
        setUser(null);
      }
    }
    else {
      setUser(null);
    }
  }

  useEffect(() => {
    (() => { // wrapping it in a function to make a warning shut up, i need to figure out a better fix later
      reloadUser();
    })()
  }, []);

  return (
    <UserContext.Provider value={user}>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
      </Routes>
    </UserContext.Provider>
  )
}

export default App
