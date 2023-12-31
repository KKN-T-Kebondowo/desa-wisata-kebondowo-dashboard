import React, { useContext, useEffect, useState } from 'react';
import { Navigate, useNavigate, useRoutes } from 'react-router-dom';
import { AuthContext } from './providers/authProvider'; // Import AuthContext
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
import BlogPage from './pages/BlogPage';
import TourismPage from './pages/TourismPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import CreateBlogPostPage from './pages/CreateBlogPostPage';
import UpdateBlogPostPage from './pages/UpdateBlogPostPage';
import CreateTourismPage from './pages/CreateTourismPage';
import UpdateTourismPage from './pages/UpdateTourismPage';
import CreateTourismPicturePage from './pages/CreateTourismPicturePage';
import UMKMPage from './pages/UMKMPage';
import CreateUMKMPage from './pages/CreateUMKMPage';
import UpdateUMKMPage from './pages/UpdateUMKMPage';
import CreateUMKMPicturePage from './pages/UMKMPicturePage';

export default function Router() {
  const { isAuthenticated } = useContext(AuthContext); // Access token from AuthContext
  const [path, setPath] = useState('');
  const navigate = useNavigate();
  if (path === '') {
    setPath(window.location.pathname);
  }

  useEffect(() => {
    if (path !== window.location.pathname) {
      navigate(path);
    }
  }, []);

  const routes = useRoutes([
    {
      path: 'dashboard',
      element: isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />,
      children: [
        { element: <Navigate to="/dashboard/home" />, index: true },
        { path: 'home', element: <DashboardAppPage /> },
        { path: 'tourisms', element: <TourismPage /> },
        { path: 'tourisms/new', element: <CreateTourismPage /> },
        { path: 'tourisms/update/:tourismSlug', element: <UpdateTourismPage /> },
        { path: 'tourisms/update/:tourismSlug/pictures', element: <CreateTourismPicturePage /> },
        { path: 'galleries', element: <ProductsPage /> },
        { path: 'articles', element: <BlogPage /> },
        { path: 'articles/new', element: <CreateBlogPostPage /> },
        { path: 'articles/update/:articleSlug', element: <UpdateBlogPostPage /> },
        { path: 'umkm', element: <UMKMPage /> },
        { path: 'umkm/new', element: <CreateUMKMPage /> },
        { path: 'umkm/update/:umkmSlug', element: <UpdateUMKMPage /> },
        { path: 'umkm/update/:umkmSlug/pictures', element: <CreateUMKMPicturePage /> },
      ],
    },
    {
      path: 'login',
      element: isAuthenticated ? <Navigate to="/dashboard/home" /> : <LoginPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/home" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
