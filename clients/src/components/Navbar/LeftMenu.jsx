import React from 'react';
import { Menu, Grid } from 'antd';


const { useBreakpoint } = Grid;

const LeftMenu = () => {
  const { md } = useBreakpoint()
  return (
    <Menu mode={md ? "horizontal" : "inline"}>
      <Menu.Item key="alipay">
        <a href="/help">Help</a>
      </Menu.Item>
    </Menu>
  );
}

export default LeftMenu;