import React from 'react';
import { useSelector } from 'react-redux'
import { Menu, Grid } from 'antd';


const { useBreakpoint } = Grid;

const RightMenu = () => {
  const { isAuth } = useSelector((state) => state.auth)
  const { md } = useBreakpoint();
  return (
    isAuth ? (
      <div>
        <a href to='/user' className='mx-3'>
          <span>Dashboard</span>
        </a>
      </div>
    ) : (
    <Menu mode={md ? "horizontal" : "inline"}>
      <Menu.Item key="mail">
        <a href="/login">Login</a>
      </Menu.Item>
      <Menu.Item key="app">
        <a href="/register">Signup</a>
      </Menu.Item>
    </Menu>
  ));
}

export default RightMenu;