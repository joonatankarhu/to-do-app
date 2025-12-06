import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import './Layout.css';
import { useAppDispatch } from '@src/store/hooks';
import { fetchUser } from '@src/store/authUser';
import Navbar from '@src/components/Navbar/Navbar';
import Footer from '@src/components/Footer/Footer';

function Layout() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return (
    <div className="layout">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;

