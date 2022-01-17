import { createRouter, createWebHashHistory } from "vue-router"

const routes = [
    {
        path: "/",
        name: "Accueil",
        component: () => import("../components/Accueil"),
    },
    {
        path: "/signin",
        name: "Connexion",
        component: () => import("../components/Connexion"),
    },
    {
        path: "/signup",
        name: "Inscription",
        component: () => import("../components/Inscription")
    },
    {
        path: "/account",
        name: "Compte",
        component: () => import("../components/Compte")
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const publicPages = ["/", "/connexion", "/inscription"]
    const authRequired = !publicPages.includes(to.path)
    const loggedIn = localStorage.getItem("userId")
    const loggedToken = localStorage.getItem("token")
    if (authRequired && !loggedIn && !loggedToken) {
        return next("/connexion")
    }
    next()
})

export default router