import React from 'react'
import AdminDrawer from '../components/AdminPage/AdminDrawer'
import GeoJsonTable from '../components/AdminPage/GeoJsonTable'
import NavbarAdmin from '../components/Navbar/NavbarAdmin'
//import Foot from '../components/Footer/Footer'

const AdminGeoJsonList = () => {
  return (
    <div>
    <NavbarAdmin />
    <div className="admins"style={{display:"flex", flexDirection:"row"}}>
    <AdminDrawer/>
    <GeoJsonTable/>
    </div>
    </div>
  )
}

export default AdminGeoJsonList