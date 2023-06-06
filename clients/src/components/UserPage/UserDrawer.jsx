import {useState, useEffect} from 'react'
import {Menu} from "antd";
import {  PoweroffOutlined,  UserOutlined ,QuestionCircleOutlined, SnippetsOutlined } from '@ant-design/icons';
import { useNavigate} from 'react-router-dom'
import { fetchProtectedInfo, onLogout } from '../../api/auth'
import { unauthenticateUser } from '../../redux/slices/authSlice'
import { useDispatch } from 'react-redux'

const UserDrawer = () => {
    const [loading, setLoading] = useState(true)
  const [protectedData, setProtectedData] = useState(null)
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const logout = async () => {
        try {
          await onLogout();
    
          dispatch(unauthenticateUser());
          localStorage.removeItem('isAuth');
    
          // Redirect to the login page or any other desired page
          navigate('/login');
        } catch (error) {
          console.log(error.response);
        }
      };
      const protectedInfo = async () => {
        try {
          const { data } = await fetchProtectedInfo()
    
          setProtectedData(data.info)
    
          setLoading(false)
        } catch (error) {
          logout()
        }
      }
      useEffect(() => {
        protectedInfo()
      }, [])
      const handleMenuClick = ({ key }) => {
        if (key === 'logout') {
          logout(); // Call the logout function when "Logout" is clicked
        } else {
            navigate(`/user${key}`); // Handle other menu item clicks
        }
      };
      const menuItems = [
        { label: 'GeoJSON List', key: '/geojsons', icon: <SnippetsOutlined /> },
        { label: 'Profile', key: '/user/profile', icon: <UserOutlined /> },
        { label: 'Help', key: '/user/help', icon: <QuestionCircleOutlined /> },
        { label: 'Logout', icon: <PoweroffOutlined />, danger: true, key: 'logout' },
      ];
  return (
    <div style={{display:"flex", flexDirection:"row", height:"100vh"}}>
        
        <div style={{ display: 'flex', flexDirection: 'row', height: '100vh' }}>
      <Menu onClick={handleMenuClick} items={menuItems} />
    </div>
    </div>
  )
}

export default UserDrawer