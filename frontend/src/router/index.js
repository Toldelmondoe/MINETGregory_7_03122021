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
    component: () => import('../views/Connexion.vue')
  },
  {
    path: '/signup',
    name: 'Inscription',
    component: () => import('../views/Inscription')
  },
  
  {
    path: '/compte',
    name: 'Compte',
    component: () => import('../views/Compte')
  },
  {
    path: "/compte/posts",
    name: "Mes Messages",
    component: () => import("../views/PostsUser")
  },
  {
    path: '/posts',
    name: 'Posts',
    component: () => import('../views/Posts')
  },
  {
    path: "/post/edit/:id",
    name: "Post Edit",
    component: () => import("../views/PostEdit")
  },
  {
    path: "/post/drop/:id",
    name: "Post Drop",
    component: () => import("../views/PostDrop")
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})


router.beforeEach((to, from, next) => {
    const publicPages = ["/", "/signin", "/signup"]
    const authRequired = !publicPages.includes(to.path)
    const loggedIn = localStorage.getItem("userId")
    const loggedToken = localStorage.getItem("token")
    if (authRequired && !loggedIn && !loggedToken) {
        return next("/signin")
    }
    next()
})

export default router
