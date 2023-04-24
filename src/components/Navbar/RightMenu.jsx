import React from 'react';
import { Menu, Grid } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const { useBreakpoint } = Grid;

const RightMenu = () => {
  const { md } = useBreakpoint();
  return (
    <Menu mode={md ? "horizontal" : "inline"}>
      <Menu.Item key="mail">
        <a href="/login">Login</a>
      </Menu.Item>
      <Menu.Item key="app">
        <a href="/signup">Signup</a>
      </Menu.Item>
    </Menu>
  );
}

export default RightMenu;