import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes';

const { BASE_URL } = process.env;

const history = createWebHistory(BASE_URL);

const linkActiveClass = "active";
const linkExactActiveClass = "exact-active";

export default createRouter({ history, routes, linkActiveClass, linkExactActiveClass });
