import {
  BrowserRouter,
  Navigate,
  Routes,
  Route,
  Outlet,
} from 'react-router-dom'
import Dashboard from './pages/dashboard'
import Home from './pages/home'
import Login from './pages/login'
import Register from './pages/register'
import { useSelector } from 'react-redux'
import Help from './pages/Help';
import AdminUserList from './pages/AdminUserList';
import AdminProfile from './pages/AdminProfile';
import AdminSettings from './pages/AdminSettings';
import AdminGeoJsonList from './pages/AdminGeoJsonList';
import UserGeoJsonList from './pages/UserGeoJsonList';
import User from './pages/User';
import Admin from './pages/Admin';

const PrivateRoutes = () => {
  const { isAuth } = useSelector((state) => state.auth)
  
  return <>{isAuth ? <Outlet /> : <Navigate to='/login' />}</>
}

const RestrictedRoutes = () => {
  const { isAuth } = useSelector((state) => state.auth)
  return <>{!isAuth ? <Outlet/>  : <Navigate to='/user'/> }</>
  
}

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />

        <Route element={<PrivateRoutes />}>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/user/geojsons' element={<UserGeoJsonList />} />
          <Route path="/user" element={<User />} />
          <Route path="/admin" element={<User />} />
        </Route>

        <Route element={<RestrictedRoutes />}>
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/help' element={<Help />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
            <Route path="/admin/users" element={<AdminUserList />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/geojsons" element={<AdminGeoJsonList />} />
            <Route path="/admin" element={<Admin />} />
            
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
