import React from 'react';
import { Menu, Grid, Avatar,Dropdown, message, Space} from 'antd';
import { UserOutlined,PoweroffOutlined,SettingOutlined } from '@ant-design/icons';
import {Link} from 'react-router-dom';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const { useBreakpoint } = Grid;



function randomColor() {
  let hex = Math.floor(Math.random() * 0xFFFFFF);
  let color = "#" + hex.toString(16);

  return color;
}

const RightMenuUser = () => {
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
              <Menu.Item key="3" danger={true}>
              <Link to="/"><PoweroffOutlined/> Logout</Link>
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