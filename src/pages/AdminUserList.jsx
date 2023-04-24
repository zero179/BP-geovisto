import React from 'react'
import AdminDrawer from '../components/AdminPage/AdminDrawer'
import UserListTable from '../components/AdminPage/UserListTable'
import NavbarAdmin from '../components/Navbar/NavbarAdmin'
import Foot from '../components/Footer/Footer'

const AdminUserList = () => {
  return (
    <div>
    <NavbarAdmin />
    <div className="admins"style={{display:"flex", flexDirection:"row"}}>
    <AdminDrawer/>
    <UserListTable/>
    </div>
    <Foot/>
    </div>
  )
}

export default AdminUserList