import React, { Component } from 'react';
import LeftMenu from './LeftMenu'
import RightMenu from './RightMenu'
import { Drawer, Avatar, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import RightMenuAdminSmall from './RightMenuAdminSmall'
import "./navbarElements.css";
import RightMenuUser from './NavbarUserRight';
import LogoutButton from './LogoutButton';


class NavbarUser extends Component {
	state = {
		current: 'mail',
		visible: false
	}
	showDrawer = () => {
		this.setState({
			visible: true,
		});
	};

	onClose = () => {
		this.setState({
			visible: false,
		});
	};
    
    

	render() {
		return (
			<nav className="menuBar">
				<div className="logo">
					<a href="/">GEOVISTO</a>
				</div>
                <div className="button">
                    <LogoutButton/>
                </div>
				<div className="menuCon">
					
					<div className="rightMenu">
						<RightMenuUser />
					</div>
					<Button className="barsMenu" type="text" onClick={this.showDrawer}>
						<span className="barsBtn"></span>
					</Button>
					<Drawer
						className="drawer-body"
						closable={true}
						title="Geovisto Menu"
						placement="right"
						onClose={this.onClose}
						visible={this.state.visible}
					>

						<RightMenuAdminSmall />
					</Drawer>

				</div>
			</nav>
		);
	}
}

export default NavbarUser;