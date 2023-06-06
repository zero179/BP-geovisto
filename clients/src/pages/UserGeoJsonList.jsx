import React from 'react'
import UserDrawer from '../components/UserPage/UserDrawer'
import UserGeoJsonListTable from '../components/UserPage/GeoJsonTable'
import NavbarUser from '../components/Navbar/NavbarUser'
//import Foot from '../components/Footer/Footer'

const UserList = () => {
  return (
    <div>
    <NavbarUser />
    <div className="admins"style={{display:"flex", flexDirection:"row"}}>
    <UserGeoJsonListTable/>
    </div>
    </div>
  )
}

export default UserList