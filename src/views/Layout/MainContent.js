import React from 'react';
import { Redirect, withRouter, Route, Switch } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import routes  from '../../routes/routes';
import { connect } from 'react-redux';
import { Layout } from 'antd';
const { Content } = Layout;

const MainContent = ({ location }) => {
	// const roleType = localStorage.getItem('userInfo') && JSON.parse(localStorage.getItem('userInfo')).role.type;
	const role= localStorage.getItem('userInfo')&&JSON.parse(localStorage.getItem('userInfo')).role
	const handleFilter = permission => {
		if(!permission|| permission===role){
			return true
		}
		return false
	};
	 
	return (
		<TransitionGroup>
			<CSSTransition classNames="fade" key={location.pathname} timeout={500}>
				<Content style={{ padding: '15px' }}>
					<Switch>
						{routes.map(ele => handleFilter(ele.permission)&& <Route  key={ele.path} path={ele.path} exact render={() => <ele.component />}/>)}
						<Redirect from="/" exact to="/home" />
					</Switch>
				</Content>
			</CSSTransition>
		</TransitionGroup>
	);
};

const mapStateToProps = state => ({ userInfo: state.userInfo });
export default withRouter(connect(mapStateToProps)(MainContent));
