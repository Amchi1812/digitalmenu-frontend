import { Routes, Route, Navigate } from 'react-router-dom';

import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { SuperAdminLayout } from './pages/SuperAdminLayout';
import { RstaurantList } from './pages/RestaurantList';
import { CreateRestaurant } from './pages/CreateRestaurant';
import { CreateRestaurantAdmin } from './pages/CreateRestaurantAdmin';
import { RestoranAdminLayout } from './pages/RestoranAdminLayout';
import { CategoriesList } from './pages/CategoriesList';
import { CreateCategory } from './pages/CreateCategory';
import { EditCategory } from './pages/EditCategory';
import { MenuItemsList } from './pages/MenuItemsList';
import { CreateMenuItem } from './pages/CreateMenuItem';
import { EditMenuItem } from './pages/EditMenuItem';
import { PublicMenuSwitch } from './pages/public/PublicMenuSwitch';
import { Toaster } from 'react-hot-toast';

export function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#0d261ecd', 
            color: '#fff',
            borderRadius: '18px',
            fontSize: '0.9rem',
            padding: '1rem',
            backdropFilter: 'blur(5px)'
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Routes>
        {/*JAVNE RUTE*/}
        <Route path="/login" element={<Login />} />


        <Route path="/menu/:slug" element={<PublicMenuSwitch />} />
        <Route path="/" element={<PublicMenuSwitch />} />

        {/* ZAŠTIĆENE RUTE ZA SUPERADMINA */}
        <Route element={<ProtectedRoute allowedRoles={['SuperAdmin']} />}>
          <Route element={<SuperAdminLayout />}>
            <Route path="/superadmin" element={<Navigate to="/superadmin/restaurants" replace />} />
            <Route path="/superadmin/restaurants" element={<RstaurantList />} />
            <Route path="/superadmin/restaurants/new" element={<CreateRestaurant />} />
            <Route path="/superadmin/create-admin" element={<CreateRestaurantAdmin />} />
          </Route>
        </Route>

        {/* ZAŠTIĆENE RUTE ZA RESTORAN ADMINA */}
        <Route element={<ProtectedRoute allowedRoles={['RestoranAdmin']} />}>
          <Route element={<RestoranAdminLayout />}>
            <Route path="/admin" element={<Navigate to="/admin/categories" replace />} />
            <Route path="/admin/categories" element={<CategoriesList />} />
            <Route path="/admin/categories/new" element={<CreateCategory />} />
            <Route path="/admin/categories/edit/:id" element={<EditCategory />} />
            <Route path="/admin/menu-items" element={<MenuItemsList />} />
            <Route path="/admin/menu-items/new" element={<CreateMenuItem />} />
            <Route path="/admin/menu-items/edit/:id" element={<EditMenuItem />} />
          </Route>
        </Route>

        {/* PODRAZUMIJEVANA RUTA */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;