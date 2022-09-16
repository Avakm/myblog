import Home from '../views/Home'
import Users from '../views/Users'
import ArticleAdd from '../views/Article/add'
import ArticleList from '../views/Article/list'
import ArticleDetail from '../views/Article/detail'

const routes = [
    { path: '/home', component: Home},
    { path: '/users', component: Users, permission:1},
    { path: '/article/add', component:ArticleAdd},
    { path: '/article/list', component:ArticleList},
    { path: '/article/detail/:id',component:ArticleDetail}
]

export default routes