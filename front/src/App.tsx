import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router';
import { jwtDecode, type JwtPayload } from 'jwt-decode';
import type { AxiosResponse } from 'axios';
import type { User } from './types/user';
import type { UserResponse } from './types/responses';
import UserContext from './contexts/UserContext';
import { normalAxios } from './axiosInstance';
import { getToken } from './tokenManager';
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/login/LoginPage';
import RegisterPage from './pages/register/RegisterPage';
import SettingsPage from './pages/settings/SettingsPage';
import ChangeUsernamePage from './pages/settings/ChangeUsernamePage';
import DeleteAccountPage from './pages/settings/DeleteAccountPage';
import ChangePasswordPage from './pages/settings/ChangePasswordPage';
import SetPage from './pages/set/SetPage';
import './App.css'

interface userIdJwtPayload extends JwtPayload {
  userId: string
}

function App() {
  const [user, setUser] = useState<User | null>(null);

  async function reloadUser(): Promise<void> {
    const token: string | null = getToken();
    if (token) {
      const payload = jwtDecode(token) as userIdJwtPayload;
      const id: string = payload.userId;

      const response: AxiosResponse<UserResponse> = await normalAxios.get(`/api/accounts/${id}`);
      if (response.status === 200) {
        setUser({ username: response.data.username, id });
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    reloadUser();
  }, []);

  return (
    <UserContext.Provider value={{user, reloadUser}}>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path='/:id' element={<SetPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/settings/username' element={<ChangeUsernamePage />} />
        <Route path='/settings/password' element={<ChangePasswordPage />} />
        <Route path='/settings/delete' element={<DeleteAccountPage />} />
        <Route path='/settings' element={<SettingsPage />} />
      </Routes>
    </UserContext.Provider>
  )
}

export default App
