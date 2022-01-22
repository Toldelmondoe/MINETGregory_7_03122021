import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/signin',
    name: 'Connexion',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Connexion.vue')
  },
  {
    path: "/signup",
    name: "Inscription",
    component: () => import("../views/Inscription")
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

/*
router.beforeEach((to, from, next) => {
    const publicPages = ["/", "/signin", "/signup"]
    const authRequired = !publicPages.includes(to.path)
    const loggedIn = localStorage.getItem("userId")
    const loggedToken = localStorage.getItem("token")
    if (authRequired && !loggedIn && !loggedToken) {
        return next("/signin")
    }
    next()
})*/

export default router
