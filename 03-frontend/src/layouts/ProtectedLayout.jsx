import { useContext, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext.jsx';
import { Outlet, useNavigate } from 'react-router-dom';

const ProtectedLayout = () => {
  const { user, isRefreshing } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (isRefreshing) return;
    if (!user) navigate('/signup');
  }, [user, navigate, isRefreshing]);

  if (!user) return null;

  return <Outlet />;
};

export default ProtectedLayout;
