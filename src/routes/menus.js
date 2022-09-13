/**
 * @ Description:权限控制，permission 1==超级管理员，其它为普通用户
 */
 import {
    HomeOutlined,
    UserOutlined ,
    ReadOutlined,
    AuditOutlined
} from '@ant-design/icons';

const menus = [
    {
		path: '/home',
		title: '首页',
		icon: <HomeOutlined />
	},
	{
		path: '/users',
        role:true,
        permission:1,
		title: '用户信息',
		icon: <UserOutlined />
	},
    {
        path:'/article',
        title:'文章管理',
        icon:<AuditOutlined />,
        children:[
            {
                path:'/article/add',
                title:'发表文章'
            },
            {
                path:'/article/list',
                title:'文章列表'
            }
        ]
    }
]

export default menus