import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { fetchProtectedInfo, onLogout } from '../../api/auth'
import { unauthenticateUser } from '../../redux/slices/authSlice'
import { Menu, Grid, Avatar,Dropdown} from 'antd';
import { UserOutlined,PoweroffOutlined,SettingOutlined } from '@ant-design/icons';
import {Link} from 'react-router-dom';

const { useBreakpoint } = Grid;




function randomColor() {
  let hex = Math.floor(Math.random() * 0xFFFFFF);
  let color = "#" + hex.toString(16);

  return color;
}

const RightMenuUser = () => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const [protectedData, setProtectedData] = useState(null)

  const logout = async () => {
    try {
      await onLogout()
  
      dispatch(unauthenticateUser())
      localStorage.removeItem('isAuth')
    } catch (error) {
      console.log(error.response)
    }
  }

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

  const { md } = useBreakpoint();
  return (
    <Menu mode={md ? "horizontal" : "inline"}>
      <Menu.Item key="avatar">
    <Dropdown
          overlay={(
            <Menu>
              <Menu.Item key="0">
                <Link to="/user/settings"><SettingOutlined />Settings</Link>
              </Menu.Item>
              <Menu.Item key="1">
              <Link to="/user/profile"><UserOutlined/> Profile</Link>
              </Menu.Item>
              <Menu.Item key="2">
              <Link to="/user/geojsons"><UserOutlined/> GeoJSONS</Link>
              </Menu.Item>
              <Menu.Item key="3" danger={true} onClick={() => logout()}>
              <PoweroffOutlined/> Logout
              </Menu.Item>
            </Menu>
          )}
          trigger={['click']}
          >
          <a className="ant-dropdown-link" 
             onClick={e => e.preventDefault()}>
            <Avatar
      variant="circle"
      icon={<UserOutlined/>}
      style={{
        backgroundColor: randomColor()
      }}
    />
          </a>
        </Dropdown>
      </Menu.Item>
    </Menu>
  );
}

export default RightMenuUser;