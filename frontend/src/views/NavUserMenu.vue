<template>
    <div id="navbarContent" class="m-0 p-0 justify-content-end align-self-center">
        <div class="nav-item dropdown m-0 p-0">
            <a class="nav-item nav-link m-0 p-0" href="#" data-toggle="dropdown" id="my_account" aria-haspopup="true" aria-expanded="false">
                <img :src="avatar" alt="Image de profile" height="70" class="my-0 rounded-circle"/>
            </a>
            <div class="dropdown-menu center" aria-labelledby="my_account">
                <p class="h5 dropdown-item-text text-primary text-center">{{username}}</p>
                <div class="dropdown-divider"></div>
                <div class="d-flex"><img src="/images/user.png" fill="text-primary" class="pl-4" height="35"><router-link to="/Compte" class="dropdown-item pl-1 text-primary">Mon compte</router-link></div>
                <div class="dropdown-divider"></div>
                <div class="d-flex"><img src="/images/email.png" fill="text-primary" class="pl-4" height="35"><router-link to="/Compte/Posts" class="dropdown-item pl-1 text-primary">Mes messages</router-link></div>
                <div class="dropdown-divider"></div>
                <div class="d-flex"><img src="/images/messages.png" fill="text-primary" class="pl-4" height="35"><router-link to="/Compte/Comments" class="dropdown-item pl-1 text-primary">Mes commentaires</router-link></div>
                <div class="dropdown-divider"></div>
                <div class="d-flex"><img src="/images/switch.png" fill="text-primary" class="pl-4" height="35"><a class ="dropdown-item pl-1 text-danger" @click="deconnexion" href="#">Déconnexion</a></div>
            </div>
        </div>            
    </div>
</template>

<script>
import Swal from "sweetalert2"
export default {
    name: "NavUserMenu",
    data() {
        return {
            username: "", 
            avatar: ""
        }
    },
    created: function() {
            this.username = localStorage.getItem("username") 
            this.avatar = localStorage.getItem("avatar") 
    },
    methods: {
        deconnexion: function() {
            localStorage.clear()
            Swal.fire({
                text: "Déconnexion en cours !",
                footer: "Redirection en cours...",
                icon: "info",
                timer: 2000,
                showConfirmButton: false,
                timerProgressBar: true,
                willClose: () => { location.reload() }
            })
        }
    }
}
</script>

<style>
.center {
  left: -160%;
}

@media screen and (max-width: 1290px) {
    .center {
        left: -200%;
    }
}

@media screen and (max-width: 1246px) {
    .center {
        left: -320%;
    }
}

@media screen and (max-width: 368px) {
    .center {
        left: -10%;
    }
}
</style>