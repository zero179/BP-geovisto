import React from 'react';
import { Menu, Grid, Avatar,Dropdown, message, Space} from 'antd';
import { UserOutlined,PoweroffOutlined,SettingOutlined } from '@ant-design/icons';
import { makeStyles } from '@mui/styles';
import { withStyles, createStyles } from "@material-ui/core/styles";
import {Link} from 'react-router-dom';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const { useBreakpoint } = Grid;



const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    large: {
      fontSize: "2.5rem",
      width: 100,
      height: 100
    }
  })
);

function randomColor() {
  let hex = Math.floor(Math.random() * 0xFFFFFF);
  let color = "#" + hex.toString(16);

  return color;
}

const RightMenuAdmin = () => {
  const { md } = useBreakpoint();
  return (
    <Menu mode={md ? "horizontal" : "inline"}>
      <Menu.Item key="avatar">
    <Dropdown
          overlay={(
            <Menu>
              <Menu.Item key="0">
                <Link to="/admin/settings"><SettingOutlined />Settings</Link>
              </Menu.Item>
              <Menu.Item key="1">
              <Link to="/admin/profile"><UserOutlined/> Profile</Link>
              </Menu.Item>
              <Menu.Item key="2" danger={true}>
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

export default RightMenuAdmin;