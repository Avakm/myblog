import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { Layout, Menu, Image } from 'antd';
import { setUserInfo } from '../../store/actions/userInfo';
import { addTag } from '../../store/actions/tagList';
import menus from '../../routes/menus';
import routes  from '../../routes/routes';
import Logo from '../../assets/img/logo2021.png'
const { Sider } = Layout;
const { SubMenu } = Menu;

class SideNenu extends Component {

	state = { menuSelected: this.props.history.location.pathname };

	handleFilter = permission => {
		const role = localStorage.getItem('userInfo')&&JSON.parse(localStorage.getItem('userInfo')).role
		//过滤没有权限的页面
		if (!permission || permission === role) {
			return true;
		}
		return false;
	};

	// 点击之后加入页签
	handClickTag(currentLink, parent) {
		const { path, title } = currentLink;
		for (let i = 0; i < routes.length; i++) {
			if (path === routes[i].path) {
				let obj = { path, title, component: routes[i].component };
				this.props.addTag(parent ? Object.assign({}, obj, { parent: parent.title }) : obj);
			}
		}
	}
	// 递归渲染菜单
	renderMenu = data => {
		return data.map(item => {
			if (item.children) {
				return (
					<SubMenu
							key={item.path}
                            icon={item.icon&&item.icon}
							title={
								<span>
									{/* {item.icon ? <Icon type={item.icon} /> : ''} */}
									<span>{item.title}</span>
								</span>
							}
						>
							{this.renderMenu(item.children)}
						</SubMenu>
				);
			}
			return (
				this.handleFilter(item.permission) && (
					<Menu.Item key={item.path} icon={item.icon&&item.icon}>
						<Link to={item.path} onClick={() => this.handClickTag(item)}>
							{/* {item.icon ? <Icon type={item.icon} /> : ''} */}
							<span>{item.title}</span>
						</Link>
					</Menu.Item>
				)
			);
		});
	};
	render() {
		// console.log(this.props);
		const menuSelected = this.props.history.location.pathname;
		const menuOpened = `/${menuSelected.split('/')[1]}`;
		const type = this.props.theme.type;
		const { collapse } = this.props;
		return (
			<Sider trigger={null} collapsible collapsed={collapse.isCollapsed} className="app-sider">
				<h2 className="logo" style={{ color: type === 'dark' ? '#ffffffa6' : '' }}>
					博客管理后台
				</h2>
				<Menu style={{ height: '50px' }} theme={type} defaultOpenKeys={[menuOpened]} defaultSelectedKeys={[menuSelected]} selectedKeys={[menuSelected]} mode="inline">
					{this.renderMenu(menus)}
				</Menu>
			</Sider>
		);
	}
}

const mapStateToProps = state => state;
const mapDispatchToProps = dispatch => ({
	setUserInfo: data => {
		dispatch(setUserInfo(data));
	},
	addTag: data => {
		dispatch(addTag(data));
	}
});
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(SideNenu));
