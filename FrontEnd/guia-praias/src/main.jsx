import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

//react router
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

//toastify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/Landing';
import Register from './pages/Register';
import PraiasPage from './pages/PraiasPage';
import DetalhePraiaPage from './pages/DetalhePraia';


const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />
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
    path: "cadastro",
    element: <Register />
  },
  {
    path: "/praias",
    element: <PraiasPage />
  },
  {
    path: "/praias/:id",
    element: <DetalhePraiaPage />
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <ToastContainer />
      <RouterProvider router={router} />
  </StrictMode>,
)