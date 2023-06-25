import React, { Component } from 'react';
import LeftMenu from './LeftMenu';
import RightMenu from './RightMenu';
import { Drawer, Button } from 'antd';
import "./navbarElements.css";

class Navbar2 extends Component {
	state = {
		current: 'mail',
		visible: false
	};

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
				<div className="menuCon">
					<div className="menuItems">
						<div className="leftMenu">
							<LeftMenu />
						</div>
						<div className="rightMenu">
							<RightMenu />
						</div>
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
						<LeftMenu />
						<RightMenu />
					</Drawer>
				</div>
			</nav>
		);
	}
}

export default Navbar2;