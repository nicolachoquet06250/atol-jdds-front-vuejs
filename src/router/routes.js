import Home from "../views/Home";
import NotFound from '../views/errors/404';

export default [
    {
        path: '/',
        name: 'Home',
        title: 'Home',
        hide: true,
        redirect: '/jdds',
        component: Home
    },
    {
        path: '/jdds',
        name: 'get-jdds',
        title: 'Liste des JDDs',
        component: () => import('../views/GetJdds.vue')
    },
    {
        path: '/jdd/add',
        name: 'add-jdd',
        hide: true,
        disabled: false,
        title: 'Créer un JDD',
        component: () => import('../views/AddJdd.vue')
    },
    {
        path: '/about',
        name: 'About',
        title: 'A propos',
        component: () => import('../views/About.vue')
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'page-not-found',
        hide: true,
        title: 'Page Not found',
        component: NotFound
    }
];