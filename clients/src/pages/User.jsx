import NavbarUser from '../components/Navbar/NavbarUser'
import { Demo } from '../components/ReactGeovistoMap/Demo'
import { useLocation } from 'react-router-dom';

const User = () => {
  const location = useLocation();
  const { mojeData } = location.state || {};

  return (
    <>
    
    <NavbarUser />
    <Demo mojeData={mojeData} />
    </>
  )
}

export default User