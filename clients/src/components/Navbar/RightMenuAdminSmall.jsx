import React from 'react';
import { Menu, Grid } from 'antd';
import {Link} from 'react-router-dom';
import { UserOutlined,PoweroffOutlined,SettingOutlined } from '@ant-design/icons';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const { useBreakpoint } = Grid;

const RightMenuAdminSmall = () => {
  const { md } = useBreakpoint();
  return (
    <Menu mode={md ? "horizontal" : "inline"}>
      <Menu.Item key="anon">
        <Link to="/admin/settings"><SettingOutlined />  Settings</Link>
      </Menu.Item>
      <Menu.Item key="mail">
        <Link to="/admin/profile"><UserOutlined/> Profile</Link>
      </Menu.Item>
      <Menu.Item key="app"danger={true} >
        <PoweroffOutlined/> Logout
      </Menu.Item>
    </Menu>
  );
}

export default RightMenuAdminSmall;