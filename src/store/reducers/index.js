import { combineReducers } from 'redux';
import userInfo from './userInfo';
import tagList from './tagList';
import academy from './academy'
import { breadCrumb, tags, theme, collapse } from './setting';
export default combineReducers({ userInfo, tagList, breadCrumb, tags, theme, collapse, academy });
