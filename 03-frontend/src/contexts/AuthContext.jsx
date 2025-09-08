import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToasterContext } from './ToasterContext.jsx';

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(true);

  const navigate = useNavigate();

  const { toaster } = useContext(ToasterContext);

  const signup = async (formState) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Error signing up');
      const data = await res.json();

      setUser(data.data);

      toaster.success(`Welcome on Board, ${data.data.firstName}`);

      navigate('/books');
    } catch (error) {
      // console.log(error);
      toaster.error(error.message);
    }
  };

  const login = async (formState) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Error logging in');
      const data = await res.json();

      setUser(data.data);

      toaster.success(`Welcome back, ${data.data.firstName}`);

      navigate('/books');
    } catch (error) {
      // console.log(error);
      toaster.error(error.message);
    }
  };

  const logout = async () => {
    try {
      // Cookie Löschen lassen
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/logout`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const { msg } = await res.json();

      if (!res.ok) throw new Error('Logout failed');
      // User State löschen
      setUser(null);

      // Fortnavigieren
      navigate('/');

      toaster.success(`Bye`);
    } catch {
      toaster.error('Logout failed. Please try again.');
    }
  };

  useEffect(() => {
    const refresh = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users/me`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!res.ok) throw Error('Please log in again');
        const { data } = await res.json();

        setUser(data);
        setIsRefreshing(false);
      } catch {
        navigate('/');
        // toaster.error(error.message);
      }
    };
    refresh();
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, setUser, signup, login, logout, isRefreshing }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
