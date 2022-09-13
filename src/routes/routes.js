import Home from '../views/Home'
import Users from '../views/Users'
import Student from '../views/Student'
import Apply from '../views/Apply'
import Academy from '../views/Academy'
import ActivityAdd from '../views/Activity/add'
import ActivityList from '../views/Activity/list'
import ArticleAdd from '../views/Article/add'
import ArticleList from '../views/Article/list'
import ArticleDetail from '../views/Article/detail'

const routes = [
    { path: '/home', component: Home},
    { path: '/users', component: Users, permission:1},
    { path:'/student',component: Student},
    { path: '/apply', component: Apply},
    { path: '/academy', component:Academy},
    { path: '/activity/add',component:ActivityAdd},
    { path: '/activity/list',component:ActivityList},
    { path: '/article/add', component:ArticleAdd},
    { path: '/article/list', component:ArticleList},
    { path: '/article/detail/:id',component:ArticleDetail}
]

export default routes