<template>
    <div>    
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-12 col-md-10 col-lg-8">
                    <div class="card bg-light">
                        <p class="h5 my-3 text-center" style="color:#008EAB;">Bienvenue sur le réseau social interne Groupomania</p>
                        <div class="card-header bg-light d-flex flex-column justify-content-center">
                            <router-link to="/"><img src="../assets/icon-left-font-monochrome-black.svg" class="offset-lg-2" height="60" alt="logo groupomania"></router-link>
                            <h5 class="h6 text-center" style="color:#008EAB;">Veuillez-vous identifier !</h5>
                        </div>
                        <div class="card-body col-md-8 col-lg-6 offset-md-2 offset-lg-3">
                            <form @submit.prevent="handleSubmit">
                                <div class="form-group">
                                    <label for="InputName" class="sr-only">Nom d'utilisateur :</label>
                                    <input type="text" v-model="InputName" name="InputName" class="form-control" id="InputName" aria-describedby="nameHelp" placeholder="Nom d'utilisateur" :class="{ 'is-invalid': submitted && !InputName }">
                                    <div v-show="submitted && !InputName" class="invalid-feedback">Un nom d'utilisateur est requis !</div>
                                </div>
                                <div class="form-group">
                                    <label for="InputPassword" class="sr-only">Mot de passe :</label>
                                    <input type="password" v-model="InputPassword" name="InputPassword" class="form-control" id="InputPassword" placeholder="Mot de passe" :class="{ 'is-invalid': submitted && !InputPassword }">
                                    <div v-show="submitted && !InputPassword" class="invalid-feedback">Un mot de passe est requis !</div>
                                </div>
                                <button class="btn btn-primary btn-sm btn-block">Se connecter</button>
                            </form>
                        </div>
                        <div class="card-footer bg-light">
                            <span class="text-dark">Pas de compte ? <router-link to="/signup">Inscrivez-vous</router-link> !</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios"
import router from "../router"
import Swal from "sweetalert2"
export default {
    name: "Connexion",
    data() {
        return {
            InputName: "",
            InputPassword: "",
            submitted: false
        }
    },
    methods: {
        handleSubmit() {            
            this.submitted = true
            axios.post('http://localhost:3000/api/auth/signin', { username: this.InputName, password: this.InputPassword })
            .then(function (response) {
                let currentUser = {};
                currentUser = response.data;
              localStorage.setItem("currentUser",currentUser)
              //@TODO No need for this local storages anymore....
              localStorage.setItem("token",response.data.token)
                localStorage.setItem("userId",response.data.id)
                localStorage.setItem("username",response.data.username)
                localStorage.setItem("avatar",response.data.avatar)
                localStorage.setItem("roles",response.data.roles)
                localStorage.setItem("isAdmin",response.data.roles.every(elem => ["ROLE_ADMIN"].includes(elem)))
                localStorage.setItem("isModerator",response.data.roles.every(elem => ["ROLE_MODERATOR"].includes(elem)))
                Swal.fire({
                    text: "Connexion réussie !",
                    footer: "Redirection en cours...",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false,
                    timerProgressBar: true,
                    willClose: () => { router.push("/posts") }
                })  
            })
            .catch(function(error) {
                const codeError = error.message.split("code ")[1]
                let messageError = ""
                switch (codeError){
                    case "401": messageError = "Mot de passe erroné !"; break
                    case "403": messageError = "Le compte associé à cette adresse email a été supprimé !"; break
                    case "404": messageError = "Utilisateur non-trouvé !"; break
                }
                Swal.fire({
                    title: "Une erreur est survenue",
                    text: messageError || error.message,
                    icon: "error",
                    timer: 4000,
                    showConfirmButton: false,
                    timerProgressBar: true
                })  
            })
        }
    }
}
</script>
