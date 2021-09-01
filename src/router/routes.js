import Home from "../views/Home";
import GetJdds from '../views/GetJdds.vue';
import NotFound from '../views/errors/404';
import { useGuest } from '../hooks';

const { guest } =  useGuest();

export const LOGGED = 'logged';
export const NOT_LOGGED = 'not-logged'
export const BOTH = 'both';

export default [
    {
        path: '/',
        name: 'Home',
        title: 'Home',
        hide: true,
        redirect: (() => guest.value !== false ? '/jdds' : '/login')(),
        component: Home
    },
    {
        mode: LOGGED,
        path: '/jdds',
        name: 'get-jdds',
        title: 'Liste des JDDs',
        component: GetJdds
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
        mode: NOT_LOGGED,
        path: '/login',
        name: 'login',
        title: 'Connection',
        component: () => import('../views/Login.vue')
    },
    {
        mode: BOTH,
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