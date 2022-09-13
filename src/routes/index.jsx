import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import Layout from '../views/Layout';
import Login from '../views/Login';
import Apply from '../views/Activity/add'
import AuthRouter from './AuthRouter';

const Router = () => {
    return (
        <HashRouter>
            <Switch>
                <Route component= {Apply} exact path="/order"></Route>
                <Route component={Login} exact path="/login"></Route>
                <AuthRouter path='/' component={Layout}></AuthRouter>
            </Switch>
        </HashRouter>
    )
}

export default Router