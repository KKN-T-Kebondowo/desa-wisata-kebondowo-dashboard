import React, { useContext } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import { AuthContext } from './providers/authProvider'; // Import AuthContext
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
import BlogPage from './pages/BlogPage';
import ArticlePage from './pages/ArticlePage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import CreateBlogPostPage from './pages/CreateBlogPostPage';
import UpdateBlogPostPage from './pages/UpdateBlogPostPage';

export default function Router() {
  const { isAuthenticated } = useContext(AuthContext); // Access token from AuthContext

  const routes = useRoutes([
    {
      path: 'dashboard',
      element: isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />,
      children: [
        { element: <Navigate to="/dashboard/home" />, index: true },
        { path: 'home', element: <DashboardAppPage /> },
        { path: 'destinations', element: <ArticlePage /> },
        { path: 'galleries', element: <ProductsPage /> },
        { path: 'articles', element: <BlogPage /> },
        { path: 'articles/new', element: <CreateBlogPostPage /> },
        // TODO: slug to the article to update
        { path: 'articles/update/:articleSlug', element: <UpdateBlogPostPage /> },
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
