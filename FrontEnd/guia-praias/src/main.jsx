import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import LandingPage from './pages/Landing';
import Register from './pages/Register';
import PraiasPage from './pages/PraiasPage';
import DetalhePraiaPage from './pages/DetalhePraia';
import Configuracoes from './pages/Configuracoes';
import Favoritos from './pages/Favoritos';
import Sobre from './pages/Sobre';

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />
  },
  {
    path: "/home",
    element: <Home />
  },
  {
    path: "/dashboard",
    element: <Dashboard />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/cadastro",
    element: <Register />
  },
  {
    path: "/praias",
    element: <PraiasPage />
  },
  {
    path: "/praias/:id",
    element: <DetalhePraiaPage />
  },
  {
    path: "/configuracoes",
    element: <Configuracoes />
  },
  {
    path: "/favoritos",
    element: <Favoritos />
  },
  {
    path: "/sobre",
    element: <Sobre />
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <ToastContainer />
      <RouterProvider router={router} />
  </StrictMode>,
)
