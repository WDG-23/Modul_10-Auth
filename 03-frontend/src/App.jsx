import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Books from './pages/Books';
import ReadingList from './pages/ReadingList';
import { useContext } from 'react';
import { AuthContext } from './contexts/AuthContext.jsx';
import ProtectedLayout from './layouts/ProtectedLayout.jsx';

function App() {
  // const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path='signup' element={<Signup />} />
        <Route element={<ProtectedLayout />}>
          {/* <Route path='books' element={user ? <Books /> : <Signup />} /> */}
          <Route path='books' element={<Books />} />
          <Route path='reading-list' element={<ReadingList />} />
        </Route>

        <Route path='*' element={<h1>Page not found</h1>} />
      </Route>
    </Routes>
  );
}

export default App;
