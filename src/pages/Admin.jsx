import React from 'react'
import AdminDrawer from '../components/AdminPage/AdminDrawer'
import NavbarAdmin from '../components/Navbar/NavbarAdmin'
import Foot from '../components/Footer/Footer'


const Admin = () => {
  return (
    <div>
    <NavbarAdmin />
    <AdminDrawer/>
    <Foot/>
    </div>
  )
}

export default Admin